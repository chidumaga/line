angular.module('starter.controllers', [])

.controller('BudgetCtrl', function($scope, $ionicPopup){
	$scope.model = {};
	$scope.model.budget = 0;
	$scope.progress = 0;
	$scope.totalExpenditure = 0;

	$scope.setBudgetValue = function(){
		console.log($scope.model.budget);
	}

	function calcExpenditure(expenditure, budget){
		$scope.progress = (expenditure/budget) * 100;
	}

	$scope.addExpense = function(){
		$scope.expense = {};

		$ionicPopup.show({
   			title: 'Add an expense',
   			template: 'How much did you spend?<input type="number" placeholder="amount" ng-model="expense.amount">, <br> What did you spend it on?<input type="text" placeholder="category" ng-model="expense.category" >',
   			scope: $scope,
   			buttons: [
       			{ text: 'Cancel' },
		        {
		         text: '<b>Save</b>',
		         type: 'button-positive'
		    	},
		     ]
 			}).then(function(res) {
 				$scope.totalExpenditure += $scope.expense.amount;
 				calcExpenditure($scope.totalExpenditure, $scope.model.budget);
 			});
		}

})