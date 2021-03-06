import angular from 'angular';
import GLOBAL from 'Helpers/global';
import TABLES from 'Helpers/tables';
import DUMMY from 'Helpers/dummy';

(function() {
    'use strict';

    angular
        .module('app')
        .component('pickupsBadAddress', {
            template: require('./bad-address/bad-address.html'),
            controller: PickupsCtrl,
            controllerAs: 'vm'
        })
        .component('pickupsStaging', {
            template: require('./staging/staging.html'),
            controller: PickupsCtrl,
            controllerAs: 'vm'
        })
        .component('pickupsDispatched', {
            template: require('./dispatched/dispatched.html'),
            controller: PickupsCtrl,
            controllerAs: 'vm'
        });

        PickupsCtrl.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$filter',
        'ModalService',
        'QueryService',
        'logger'
    ];

    function PickupsCtrl(
        $scope,
        $state,
        $stateParams,
        $filter,
        ModalService,
        QueryService,
        logger
    ) {
        var vm = this;
        vm.view                 = $stateParams.view || 'bad_address';
        vm.route_name           = 'booking';

        vm.titleHeader          = 'Pickups - ' + ( (vm.view=='bad_adress')?'Bad Address':(vm.view=='staging')?'Staging':(vm.view=='dispatched')?'Dispatched':'Bad Address' );

        vm.site = {};
        vm.siteId = $stateParams.siteId;
        vm.zoneId = $stateParams.zoneId;

        vm.per_page             = ['10', '20', '50', '100', '200'];
        vm.total_page           = '1';
        vm.total_items          = '0';
        vm.items                = { checkItems: [] };
        vm.checkItems           = [];
        
        vm.loading              = false;
        vm.loadingSites         = false;
        vm.loadingZones         = false;

        vm.pagination           = {};
        vm.pagination.pagestate = $stateParams.page || '1';
        vm.pagination.limit     = $stateParams.limit || '10';

        vm.option_table = { 
            defaultPagination: true,
            hideSearchByKey: true,
            searchTemplate: true 
        };

        vm.today = $filter('date')(new Date(), "yyyy-MM-dd");
        
        vm.option_table.data = [];
        vm.option_table.columnDefs = TABLES['pickup_'+vm.view].columnDefs;

        vm.dispatched_data = [
            { firstName:'Gabriel', lastName:'Diamante', assignments:'4' },
            { firstName:'Ruru', lastName:'Magana', assignments:'4' },
            { firstName:'Abel', lastName:'Madrid', assignments:'4' },
            { firstName:'Marvin', lastName:'Zabala', assignments:'4' },
            { firstName:'Christan', lastName:'Tecson', assignments:'4' },
            { firstName:'Lester', lastName:'Dequina', assignments:'4' }
        ]; // dispatched dummy data
        
        vm.goTo             = goTo;
        vm.selectSite       = selectSite;
        vm.selectZone       = selectZone;

        //function for bad address
        vm.viewMap          = viewMap;

        //function for staging
        vm.dispatch         = dispatch;

        //function for dispatched
        vm.getAssignments   = getAssignments;
        vm.transferAssignments = transferAssignments;
        vm.printAll         = printAll;
        vm.printOne         = printOne;

        //scope watch
        
        $scope.$watch('vm.items.checkItems', function(new_value, old_value) {
            vm.checkItems           = [];
            for (let n in new_value) {
                var newCheckItems = new_value[n];
                vm.checkItems = vm.checkItems.concat(newCheckItems.filter(function(el) {
                    return vm.checkItems.indexOf(el) === -1;
                }));
            }
        }, true);

        init();

        function init () {
            getSites();
            getData();
        }

        function getSites() {
            vm.loadingSites = true;
            var request = {
                method: 'GET',
                body: false,
                params: {
                    page: '1',
                    limit: '9999999999',
                    is_active: '1'
                },
                hasFile: false,
                route: { 'site': '' },
                cache: false,
                cache_string: vm.route_name
            };
            
            QueryService.query(request)
                .then(
                    function(response) {
                        console.log('sites filter', response);
                        var sites = response.data.data.items;
                        vm.sites = $filter('orderBy')(angular.copy(sites), ['-type']);
                        vm.site = checkId(vm.siteId, vm.sites);
                        vm.sites.unshift({ code: 'All', name: 'All' });
                        vm.site = vm.site || vm.sites[0];
                        getZones();
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loadingSites = false;
                });
        }
        
        function getZones() {
            vm.loadingZones = true;
        
            var req = {
                method: 'GET',
                body: false,
                params: {
                    page: 1,
                    limit: 999999999,
                    is_active: 1,
                    include_unassigned: 0,
                    
                },
                hasFile: false,
                cache: true,
                // route   : {[vm.route_name]:'' }
                route: { zone: '' }
            };

            // if (vm.site_type.code) req.params.site_type = vm.site_type.code;
            if (vm.site.id) req.params.site_id = vm.site.id;

            console.log('z req', req);

            QueryService.query(req)
                .then(
                    function(response) {
                        var zones = response.data.data.items || [];
                        vm.zones = $filter('orderBy')(angular.copy(zones), ['-type']);
                        vm.zone = checkId(vm.zoneId, vm.zones);
                        vm.zones.unshift({ code: 'All', name: 'All' });
                        vm.zone = vm.zone || vm.zones[0];
                    },
                    function(error) {
                        logger.errorFormatResponse(error);
                    }
                )
                .finally(function() {
                    vm.loadingZones = false;
                });
        }

        function checkId(id, array_val) {
            var val = array_val.filter(function(val) {
                return val.id ==id;
            })[0];
            return val;
        }

        function selectSite(site) {
            vm.siteId = site.id;
            console.log('site',site);
            $state.go($state.current.name, {
                siteId: vm.siteId,
                zoneId: ''
            });
            //getData();
        }

        function selectZone(zone) {
            vm.zoneId = zone.id;
            console.log('zone',zone);
            $state.go($state.current.name, {
                siteId: vm.siteId,
                zoneId: vm.zoneId
            });
            //getData();
        }

        function getData() {
            vm.loading = true;
            var request = {
                method: 'GET',
                body: false,
                params: { 
                    type: vm.view,
                    limit: vm.pagination.limit,
                    page: vm.pagination.pagestate,
                },
                hasFile: false,
                route: { [vm.route_name]: '' },
                cache: false,
            };

            QueryService.query(request).then(
                function(response) {
                    console.log(response);
                    vm.option_table.data = response.data.data.items;
                },
                function(error) {
                    logger.errorFormatResponse(error);
                }
            ).finally(function(){
                vm.loading = false;
            });
        }

        function handleNames(data) {
            for (let i = 0; i < data.length; i++) {
                data[i].fullname = data[i].first_name + ' ' + data[i].last_name;
            }
            return data;
        }

        function goTo(data) { 
            data.view = vm.view; 
            $state.go('app.pickups-'+vm.view, data);
        }

        //bad address function
        function viewMap (data, index) {
            data.address = data.shipper_address;
            var request = {
                method  : 'PUT',
                body    : data,
                params  : {},
                hasFile : false,
                route   : { express:'', address:'assignLatlng'},
            }; 
            
            var modal = {
                title   : 'delivery',
                titleHeader: "Update Address",
                
            };
            
            ModalService.form_modal(request, modal, 'geocodeFormModal','lg').then(
                function(response) {
                    // vm.data.splice(index, 1);
                },
                function(error) {
                    console.log(error);
                }
            );
 
        }

        // staging function
        function dispatch(data, index) {
            var reqData = {
                awbIds:null,
                bookingIds : vm.items.checkItems,
                hubId:vm.hub,
            };
            var modal = { titleHeader: "Select Courier" };
            var request = {
                method  : 'PUT',
                body    : reqData,
                params  : {all:true},
                dispatch: true,
                hasFile : false,
                route :  { 'couriers': '' }
                // route   : {express:'', bookings:'', couriers:''},
                // cache_string : ['couriers','vehicles','courier'],
            };
            
            ModalService.form_modal(request, modal, 'courierListFormModal').then(
                function(response) {
                    if (response) {
                        vm.disable = true;
                        removeSelected(vm.data);
                    }
                    // vm.data.splice(index, 1);
                },
                function(error) {
                    console.log(error);
                }
            );
        }


        //dispatched function

        function getAssignments (courier) {
            
            vm.isLoading=true;
            var r = {
                express:"",
                assignments:"",
                courier: courier.courierId
            };
           
            var params = {
                code:$stateParams.search,
                hubId: vm.hub
            };

            var req =  {
                method  : 'GET', 
                body    : false,
                params  : params, 
                hasFile : false, 
                cache   : true,
                cache_string:'assignments',
                route   : r
            };
            
            vm.option_table.data = DUMMY.users.courier_pickups;

            QueryService
                .query(req)
                .then(function (response) { 
                    vm.isLoading=false;
                    vm.assignments  = response.data.data.assignments; 
                    vm.assignmentCourier = response.data.data.courier;
                    vm.assignmentHub = response.data.data.hub;
               }, function (error) {
                    logger.errorFormatResponse(error);
                    vm.isLoading = false;
            });
        }

        function transferAssignments () {

            var reqData = {
                awbIds:{},
                bookingIds : vm.checkedItems,
                // hubId:vm.assignmentHub.id,
                // courierId:vm.assignmentCourier.courierId
            };

            var modal = { titleHeader: "Select Courier" };
            var request = {
                method  : 'PUT',
                body    : reqData,
                params  : {all:true},
                transfer: true,
                hasFile : false,
                route :  { 'couriers': '' },
                //route   : {express:'',assignments:'', transfers:'',couriers:''},
                // cache_string : ['couriers','vehicles','courier'],
            };

            // var request = {
            //     method  : 'PUT',
            //     body    : reqData,
            //     params  : {all:true},
            //     transfer:true,
            //     hasFile : false,
            //     route   : {express:'',assignments:'', transfers:'',couriers:''},
            //     // cache_string : ['couriers','vehicles','courier'],
            // };

            ModalService.form_modal(request, modal, 'courierListFormModal').then( 
                function (response) {
                    vm.disable = true;
                    for (var i = vm.couriers.length - 1; i >= 0; i--) {
                        if(vm.couriers[i].courierId == vm.assignmentCourier.courierId) {
                            vm.couriers[i].pickup = vm.couriers[i].pickup - reqData.bookingIds.length;
                            break;
                        }
                    }
                    removeSelected(vm.assignments);
                }, function (error) {
                    console.log(error);
                }
            );

        }

        function printAll () {
            var url = $state.href('pickup-sheet', {
                date:vm.today
                // hubId:vm.hub
            });
            var printPage = window.open(url,'_blank');
            // getManifest({},printAllRoute);
        }

        function printOne (data) {
            console.log(data);
             var url = $state.href('pickup-sheet', {
                date:vm.today,
                courierId:data.courierId,
                vehicleId:data.vehicleId
                // hubId:vm.hub
            });
            window.open(url,'_blank');
            // getManifest(data);
        }


    }
})();
