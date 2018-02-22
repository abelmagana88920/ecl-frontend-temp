import angular from 'angular';
import GLOBAL from 'Helpers/global';
import DUMMY from 'Helpers/dummy';
import CONSTANTS from 'Helpers/constants';

(function() {
    'use strict';

    angular.module('app').component('personnelFormModal', {
        template: require('./personnel-form.html'),
        controller: PersonnelFormModalCtrl,
        controllerAs: 'vm',
        bindings: {
            modalInstance: '<',
            resolve: '<'
        }
    });

    PersonnelFormModalCtrl.$inject = [
        '$rootScope',
        '$state',
        '$cookies',
        '$scope',
        '$stateParams',
        '$filter',
        'QueryService',
        'logger'
    ];

    function PersonnelFormModalCtrl(
        $rootScope,
        $state,
        $cookies,
        $scope,
        $stateParams,
        $filter,
        QueryService,
        logger
    ) {
        var vm = this;

        // methods
        vm.save = save;
        vm.cancel = cancel;
        vm.changeSiteType = changeSiteType;
        vm.passwordValidError = passwordValidError;

        vm.$onInit = function() {
            vm.Request = vm.resolve.Request;
            vm.Modal = vm.resolve.Modal;

            vm.titleHeader = vm.Modal.titleHeader;
            vm.data = angular.copy(vm.Request.body);
            vm.site_type = angular.copy(vm.data.site_type);
            vm.storeData = [];

            getSiteTypes();

            getSites();
            //console.log(Modal);
        };

        function getSiteTypes() {
            vm.site_types = CONSTANTS.site_types;
            vm.site_type = vm.site_type || vm.site_types[0].code;
        }

        function getSites() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: '9999999999',
                    page: '1',
                    is_active: 1,
                    type: vm.site_type
                },
                hasFile: false,
                route: { site: '' },
                cache: false
            };

            console.log('sites r', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        vm.sites = response.data.data.items;
                        vm.sites.unshift({ code: 'Select Sites' });
                        vm.data.site_id = vm.data.site_id || vm.sites[0].id;
                        // vm.total_items          = response.data.data.total;
                    },
                    function(error) {
                        logger.error(error.data.message);
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function save(data, action) {
            vm.disable = true;
            vm.loading = true;

            vm.Request.body = vm.data;

            if (vm.Modal.method == 'add') {
                console.log(vm.Modal.method);
                QueryService.query(vm.Request)
                    .then(
                        function(response) {
                            var response_data =
                                response.data.data.details || {};
                            logger.success(vm.Modal.title + ' added.');
                            close(response_data, action);
                        },
                        function(error) {
                            logger.error(
                                error.data.errors[0].message,
                                {},
                                error.data.errors[0].code
                            );
                        }
                    )
                    .finally(function() {
                        vm.loading = false;
                        vm.disable = false;
                    });
            } else if (vm.Modal.method == 'edit') {
                vm.Request.route = {
                    site: vm.data.site_id,
                    [vm.Modal.route_name]: vm.data.user_id
                };
                QueryService.query(vm.Request)
                    .then(
                        function(response) {
                            var response_data =
                                response.data.data.details || {};
                            logger.success(vm.Modal.title + ' updated.');
                            close(vm.Request.body, action);
                        },
                        function(error) {
                            logger.error(
                                error.data.errors[0].message,
                                {},
                                error.data.errors[0].code
                            );
                        }
                    )
                    .finally(function() {
                        vm.loading = false;
                        vm.disable = false;
                    });
            }
        }

        function changeSiteType(item) {
            // vm.data.site_id = null;
            getSites();
        }

        function close(data, action) {
            vm.modalInstance.close(data);
        }

        function cancel(data) {
            vm.modalInstance.close();
        }

        //validation function
        function passwordValidError() {
            return vm.data.password != vm.confirm_password;
        }
    }
})();
