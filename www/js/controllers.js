angular.module('starter.controllers', [])

.controller('BudgetCtrl', function($scope, $ionicPopup){
	$scope.model = {};
	$scope.model.budget = 0;

	$scope.expenditure = 0;
	$scope.progress = 0;

	$scope.setBudgetValue = function(){
		console.log($scope.model.budget);
	}

	function calcExpenditure(expenditure, budget){
		$scope.progress = (expenditure/budget) * 100;
	}

	$scope.addExpense = function(){
		$ionicPopup.prompt({
   			title: 'Add an expense',
   			template: 'How much did you spend?',
   			inputType: 'number',
   			inputPlaceholder: 'amount'
 			}).then(function(res) {
 				$scope.expenditure += res;
 				calcExpenditure($scope.expenditure, $scope.model.budget);
 			});
		}

})