angular.module('starter.controllers', [])

.controller('BudgetCtrl', function($scope, $ionicPopup){
	$scope.model = {};
	$scope.model.budget = 0;
	$scope.progress = 0;
	$scope.totalExpenditure = 0;
	$scope.marginLeft = 0;
	$scope.selections = [];

	var selectionCount = 0;
	var totalWidth = 0;
	var categoryExpenditure = [0,0]; //length of array equal to number of categories

	// $scope.setBudgetValue = function(){
	// 	console.log($scope.model.budget);
	// }

	function calcExpenditure(expenditure, budget){
		$scope.progress = (expenditure/budget) * 100;
	}

	$scope.addExpense = function(){
		$scope.expense = {categories : [{"key":0,"name":"Food", "color": "#e74c3c"},
		{"key":1,"name":"Groceries", "color": "#e67e22"}
		]};

		// $scope.expense.category = $scope.expense.categories[0];
	
		$ionicPopup.show({
   			title: 'Add an expense',
   			template: 'How much did you spend?<input type="number" placeholder="amount" ng-model="expense.amount"> <br> What did you spend it on? <br> <select ng-model="expense.category" ng-options="category as category.name for category in expense.categories" ng-change="updateCategory(expense.category)"></select>',
   			scope: $scope,
   			buttons: [
       			{ text: 'Cancel', onTap: function(e) { return "cancelled"; } },
		        {
		         text: '<b>Add</b>',
		         type: 'button-positive'
		    	},
		     ]
 			}).then(function(res) {
 				if(res==="cancelled"){
 					return;
 				} else {
 					totalWidth += $scope.progress;
 					$scope.totalExpenditure += $scope.expense.amount;

 					calcExpenditure($scope.expense.amount, $scope.model.budget);
 					setSelectionProperties();
 				}
 			});
		}

	$scope.updateCategory= function(val){
		$scope.lineColor = val.color;
		$scope.categoryName = val.name;
		$scope.categoryKey = val.key;

		categoryExpenditure[val.key] += $scope.expense.amount;
	}

	function setSelectionProperties(){
		selectionCount += 1;
		previousSelection = selectionCount-1

		$scope.selections.push({});
		$scope.selections[previousSelection].index = selectionCount;
		$scope.selections[previousSelection].width = $scope.progress;
		$scope.selections[previousSelection].marginLeft = totalWidth;
		$scope.selections[previousSelection].lineColor = $scope.lineColor;
		$scope.selections[previousSelection].categoryName = $scope.categoryName;
		$scope.selections[previousSelection].categoryKey = $scope.categoryKey;
	}

	$scope.getCategoryInfo = function(categoryName, categoryKey){
		var totalSpent = categoryExpenditure[categoryKey];
		var percentageSpent = (totalSpent/$scope.model.budget)*100

		$ionicPopup.alert({
     		title: '<b>'+categoryName+'</b>',
     		template: 'You have spent:<br>'+' '+totalSpent+' '+'<br>which is<br>'+' '+percentageSpent+'%<br>'+'of your overall budget.'
   		});
	}

})