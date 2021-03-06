import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular.module('app').component('history', {
        template: require('./history.html'),
        controller: HistoryCtrl,
        controllerAs: 'vm'
    });

    HistoryCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$filter',
        'ModalService',
        'QueryService',
        'logger',
        '$localStorage'
    ];

    function HistoryCtrl(
        $scope,
        $state,
        $stateParams,
        $filter,
        ModalService,
        QueryService,
        logger,
        $localStorage
    ) {
        var vm = this;
        vm.title = 'History';
        vm.titleHeader = vm.title;
        vm.view = 'hub';

        vm.TPLS = 'hubFormModal';
        vm.route_name = 'site';

        vm.deleted = $stateParams.deleted;
        vm.pagination = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit = $stateParams.limit || '10';
        vm.per_page = ['10', '20', '50', '100', '200'];
        vm.total_page = '1';
        vm.total_items = '0';
        vm.items = { roleUserCheck: [] };
        vm.loading = false;

        vm.option_table = {
            emptyColumn: true,
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: true,
            tableSearch: true
        };

        vm.option_table.columnDefs = TABLES.history.columnDefs;
        vm.option_table.data = [];

        vm.goTo = goTo;
        vm.trClick = trClick;

        vm.changeSize = changeSize;
        vm.changeListView = changeListView;

        vm.handlePostItem = handlePostItem;
        vm.handleUpdateItem = handleUpdateItem;
        vm.handleDeactivateItem = handleDeactivateItem;
        vm.handleReactivateItem = handleReactivateItem;

        getData();

        function getData() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    limit: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                    type: 'HUB',
                    is_active: vm.deleted == 'true' ? 0 : 1
                },
                hasFile: false,
                route: { [vm.route_name]: '' },
                cache: false,
                cache_string: vm.route_name
            };

            console.log('hubr', request);

            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('history', response);
                        //vm.option_table.data = response.data.data.items;

                        vm.option_table.data = angular.copy(DUMMY.history);

                        // vm.option_table.data    = handleNames(response.data.data);
                        // vm.pagination.page      = $stateParams.page || '1';
                        // vm.pagination.limit     = $stateParams.limit || '10';
                        // vm.total_page           = response.data.total_pages;
                        //vm.total_items = response.data.data.total;
                    },
                    function(err) {
                        //logger.error(MESSAGE.error, err, '');
                    }
                )
                .finally(function() {
                    vm.loading = false;
                });
        }

        function handlePostItem() {
            var modal = {
                title: vm.title,
                titleHeader: 'Add ' + vm.title,
                method: 'add'
            };

            var request = {
                method: 'POST',
                body: {},
                params: false,
                hasFile: false,
                route: { [vm.route_name]: '' }
            };

            formModal(request, modal, vm.TPLS).then(
                function(response) {
                    if (response) {
                        response.updatedAt = new Date();
                        vm.option_table.data.unshift(response);
                    }
                },
                function(error) {
                    logger.error(
                        error.data.message || catchError(request.route)
                    );
                }
            );
        }

        function handleUpdateItem(item) {
            var modal = {
                title: vm.title,
                titleHeader: 'Edit ' + vm.title,
                method: 'edit'
            };

            var request = {
                method: 'PUT',
                body: item,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: item.id }
            };

            formModal(request, modal, vm.TPLS).then(
                function(response) {
                    if (response) {
                        console.log(response);
                        vm.option_table.data[
                            vm.option_table.data.indexOf(item)
                        ] = response;
                    }
                },
                function(error) {
                    logger.error(
                        error.data.message || catchError(request.route)
                    );
                }
            );
        }

        function handleDeactivateItem(item) {
            var request = {
                method: 'PUT',
                body: false,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: item.id, deactivate: '' },
                cache: false
            };

            var content = {
                header: 'Deactivate ' + vm.title,
                message:
                    'Are you sure you want to deactivate ' +
                    vm.title.toLowerCase() +
                    ' ',
                prop: item.first_name + ' ' + item.last_name
            };

            confirmation(content).then(function(response) {
                if (response) {
                    QueryService.query(request).then(
                        function(response) {
                            vm.option_table.data.splice(
                                vm.option_table.data.indexOf(item),
                                1
                            );
                            logger.success(vm.title + ' deactivated!');
                        },
                        function(error) {
                            logger.error(
                                error.data.message || catchError(request.route)
                            );
                        }
                    );
                }
            });
        }

        function handleReactivateItem(item) {
            var request = {
                method: 'PUT',
                body: false,
                params: false,
                hasFile: false,
                route: { [vm.route_name]: item.id, reactivate: '' },
                cache: false
            };

            var content = {
                header: 'Reactivate ' + vm.title,
                message:
                    'Are you sure you want to reactivate ' +
                    vm.title.toLowerCase() +
                    ' ',
                prop: item.first_name + ' ' + item.last_name
            };

            confirmation(content).then(function(response) {
                if (response) {
                    QueryService.query(request).then(
                        function(response) {
                            vm.option_table.data.splice(
                                vm.option_table.data.indexOf(item),
                                1
                            );
                            logger.success(vm.title + ' deactivated!');
                        },
                        function(error) {
                            logger.error(
                                error.data.message || catchError(request.route)
                            );
                        }
                    );
                }
            });
        }

        function changeSize(size) {
            $state.go($state.current.name, { page: 1, size: size });
        }

        function changeListView(status) {
            $state.go($state.current.name, {
                page: 1,
                size: $stateParams.size,
                deleted: status
            });
        }

        function handleNames(data) {
            for (let i = 0; i < data.length; i++)
                data[i].fullname = data[i].first_name + ' ' + data[i].last_name;
            return data;
        }

        function goTo(data) {
            $state.go($state.current.name, data);
        }

        function trClick(data) {
            $state.go('app.hub-details', { id: data.id });
        }

        vm.toggleCheckRoleUserAll = (checkbox, model_name, propertyName) => {
            // var values_of_id = _.pluck(vm.option_table.data, propertyName);
            if (checkbox)
                GLOBAL.getModel(
                    vm.items,
                    model_name,
                    angular.copy(vm.option_table.data)
                );
            else GLOBAL.getModel(vm.items, model_name, []);
        };

        function formModal(request, modal, template, size) {
            return ModalService.form_modal(request, modal, template, size);
        }

        function confirmation(content) {
            return ModalService.confirm_modal(content);
        }
    }
})();
