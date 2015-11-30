angular.module('starter.controllers', [])

.controller('BudgetCtrl', function($scope, $ionicPopup){
	$scope.model = {};
	$scope.model.budget = 0;
	$scope.progress = 0;
	$scope.totalExpenditure = 0;

	$scope.marginLeft = 0;
	var totalWidth = 0;

	$scope.selections = [];
	var selectionCount = 0;

	// $scope.setBudgetValue = function(){
	// 	console.log($scope.model.budget);
	// }

	function calcExpenditure(expenditure, budget){
		$scope.progress = (expenditure/budget) * 100;
	}

	$scope.addExpense = function(){
		$scope.expense = {categories : [{"name":"Food", "color": "#e74c3c"},
		{"name":"Groceries", "color": "#e67e22"}
		]};

		// $scope.expense.category = $scope.expense.categories[0];
	
		$ionicPopup.show({
   			title: 'Add an expense',
   			template: 'How much did you spend?<input type="number" placeholder="amount" ng-model="expense.amount"> <br> What did you spend it on? <br> <select ng-model="expense.category" ng-options="category as category.name for category in expense.categories" ng-change="updateLineColor(expense.category)"></select>',
   			scope: $scope,
   			buttons: [
       			{ text: 'Cancel' },
		        {
		         text: '<b>Add</b>',
		         type: 'button-positive'
		    	},
		     ]
 			}).then(function(res) {
 				totalWidth += $scope.progress;
 				$scope.totalExpenditure += $scope.expense.amount;
 				
 				calcExpenditure($scope.expense.amount, $scope.model.budget);
 				setCssProperties();
 			});
		}

	$scope.updateLineColor= function(val){
		$scope.lineColor = $scope.expense.category.color
	}

	function setCssProperties(){
		selectionCount += 1;

		$scope.selections.push({});
		$scope.selections[selectionCount-1].index = selectionCount;
		$scope.selections[selectionCount-1].width = $scope.progress;
		$scope.selections[selectionCount-1].marginLeft = totalWidth;
		$scope.selections[selectionCount-1].lineColor = $scope.lineColor;
	}

})