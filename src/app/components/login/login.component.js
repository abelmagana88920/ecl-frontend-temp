import angular from 'angular';

(function() {
    'use strict';

    angular.module('app').component('login', {
        template: require('./login.html'),
        controller: LoginCtrl,
        controllerAs: 'vm'
    });

    LoginCtrl.$inject = [
        '$scope',
        '$state',
        'ModalService',
        'QueryService',
        'SessionService',
        'logger'
    ];

    function LoginCtrl(
        $scope,
        $state,
        ModalService,
        QueryService,
        SessionService,
        logger
    ) {
        var vm = this;

        vm.isPassword = false;

        // The header text on top most of the page
        vm.header = 'Login';
        vm.logo = require('Images/main-logo.png');

        vm.roles = [
            { name: 'ADMIN', value: 'ADMINISTRATOR' },
            { name: 'DISPATCHER', value: 'DISPATCHER' },
            { name: 'HUB SUPPORTS', value: 'HUB_SUPPORTS' }
        ];

        vm.role = vm.roles[0];

        // Whether the login button is clickable or not
        vm.loginButtonDisabled = false;

        // The label of the login button
        vm.loginButtonLabel = 'Login';

        // Whether to show the error message in DOM
        vm.showErrorMessage = false;

        // The error message to show if there is one
        vm.errorMessage = 'There was an error logging in.';

        vm.login = login;
        vm.forgot = forgot;
        vm.selectRole = selectRole;

        function login(user) {
            user.type = vm.role.value || 'ADMINISTRATOR';

            var req = {
                method: 'POST', // POST, GET, PUT, DELETE
                body: user, // data to be sent
                params: false, // sample { page:1, limit:10 }
                hasFile: false, // formData to be sent
                route: { auth: 'sign-in' }, // will result /users
                cache: false, // false if not needed
                cache_string: ['']
            };
            // Signal the start of login
            startLogin();

            QueryService.query(req)
                .then(function(response) {
                    var data = response.data.data;

                    // var data = response.data.data.items[0];

                    // Store this data somewhere for future use
                    SessionService.saveUser(data);

                    // Signal that login has completed
                    completeLogin();

                    // Redirect to dashboard after successful login
                    $state.go('app.dashboard');
                })
                .catch(function(response) {
                    // This means an invalid login
                    if (response.status == 400) {
                        var error = response.data.errors[0];

                        var context = error.message;

                        // Show the context as error message
                        errorLogin(context);
                    } else {
                        var message =
                            'There was a problem connecting to server.';

                        errorLogin(message);
                    }
                });
        }

        // This function sets variables accordingly when login has started
        function startLogin() {
            // Disable the login button
            vm.loginButtonDisabled = true;

            // Change the label of login button to 'Loggin in...'
            vm.loginButtonLabel = 'Logging in...';

            // Hide the errors on DOM
            vm.showErrorMessage = false;
        }

        // This function sets variables accordingly when login is successful
        function completeLogin() {
            // Enable the login button
            vm.loginButtonDisabled = false;

            // Change the label of login button to 'Login'
            vm.loginButtonLabel = 'Login';

            // Hide the errors on DOM
            vm.showErrorMessage = false;
        }

        // This function sets variables accordingly when login failed
        function errorLogin(message) {
            // Enable the login button
            vm.loginButtonDisabled = false;

            // Change the label of login button to 'Login'
            vm.loginButtonLabel = 'Login';

            // Show the error message
            vm.showErrorMessage = true;

            vm.errorMessage = message;

            logger.error(vm.errorMessage);
        }

        function forgot() {
            var content = {
                header: 'Forgot password',
                message: 'Enter registered email'
            };
            ModalService.prompt_modal(content);
        }

        function selectRole(role) {
            vm.role = role;
        }
    }
})();
