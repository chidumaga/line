angular.module('starter.controllers', [])

.controller('BudgetCtrl', function($scope, $ionicPopup, $localstorage){
	$scope.model = {};
	$scope.model.budget = parseInt($localstorage.get('budget')) || 0;
	$scope.model.currency = $localstorage.get('currency') || "GBP";
	$scope.progress = parseInt($localstorage.get('progress')) || 0;
	$scope.totalExpenditure = parseInt($localstorage.get('totalExpenditure')) || 0;
	$scope.selections = $localstorage.getObject('selections') || [];
	$scope.totalWidth = parseInt($localstorage.get('totalWidth')) || 0;

	var selectionCount = parseInt($localstorage.get('selectionCount')) || 0;
	var categoryExpenditure = $localstorage.getObject('categoryExpenditure') || [0,0,0,0,0,0,0]; //length of array equal to number of categories
	var usedCategories = $localstorage.getObject('usedCategories') || [];
	var previousBudgets = $localstorage.getObject('previousBudgets') || [];

	console.log(selectionCount);
	console.log(categoryExpenditure);

	function calcExpenditure(expenditure, budget){
		$scope.progress = (expenditure/budget) * 100;
		$scope.totalWidth += $scope.progress;

		$localstorage.set('progress', $scope.progress);
		$localstorage.set('totalWidth', $scope.totalWidth);
	}

	$scope.addExpense = function(){
		$scope.expense = {categories : [{"key":0,"name":"Food", "color": "#e74c3c"},
		{"key":1,"name":"Groceries", "color": "#e67e22"}, {"key":2,"name":"Transport", "color": "#1abc9c"},
		{"key":3,"name":"Entertainment", "color": "#f1c40f"}, {"key":4,"name":"Clothes", "color": "#9b59b6"},
		{"key":5,"name":"Phone/Internet", "color": "#DB0A5B"}, {"key":6,"name":"Rent", "color": "#F2784B"},
		{"key":7,"name":"Electronics", "color": "#95a5a6"},{"key":8,"name":"Other", "color": "#2ECC71"}
		]};
	
		$ionicPopup.show({
   			title: '<h4>Add an expense<h4>',
   			template: 'How much did you spend?<input type="number" placeholder="{{model.currency}}" ng-model="expense.amount"> <br> What did you spend it on? <br> <select class="select-style" style="width: 9em" ng-model="expense.category" ng-options="category as category.name for category in expense.categories" ng-change="updateCategory(expense.category)"></select>',
   			scope: $scope,
   			buttons: [
       			{ text: 'Cancel', onTap: function(e) { return "cancelled"; } },
		        {
		         text: '<b>Add</b>',
		         type: 'button-positive',
		         onTap: function(e) {
		         if (!$scope.expense.category) {
		           e.preventDefault();
		           alert("Enter a category");
		        	}
		    	}
		    }
		     ]
 			}).then(function(res) {
 				if(res==="cancelled"){
 					return;
 				} else {
 					$scope.totalExpenditure += $scope.expense.amount;
 					$localstorage.set('totalExpenditure', $scope.totalExpenditure);

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
		$localstorage.setObject('categoryExpenditure', categoryExpenditure);
	}

	function setSelectionProperties(){
		selectionCount += 1;
		$localstorage.set('selectionCount', selectionCount);

		previousSelection = $scope.selections.length

		if(($scope.selections.length === 0) || !isInArray($scope.categoryName, usedCategories)){
			usedCategories.push($scope.categoryName);
			$localstorage.setObject('usedCategories', usedCategories);

			$scope.selections.push({});
			$scope.selections[previousSelection].index = selectionCount;
			$scope.selections[previousSelection].width = $scope.progress;
			$scope.selections[previousSelection].lineColor = $scope.lineColor;
			$scope.selections[previousSelection].categoryName = $scope.categoryName;
			$scope.selections[previousSelection].categoryKey = $scope.categoryKey;
		} else {
			var index = usedCategories.indexOf($scope.categoryName);
			$scope.selections[index].width += $scope.progress;
		}

		$localstorage.setObject('selections', $scope.selections);
	}

	$scope.getCategoryInfo = function(categoryName, categoryKey){
		var totalSpent = categoryExpenditure[categoryKey];
		var percentageSpent = Math.round((totalSpent/$scope.model.budget)*100)

		$ionicPopup.alert({
     		title: '<h4>'+categoryName+'</h4>',
     		template: '<p>You have spent:<p>'+'<span style="font-size:2em;color:#3498db">'+$scope.model.currency+totalSpent+'</span>'+' on'+' '+categoryName+'.'+'<p>This is</p>'+'<span style="font-size:2em;color:#3498db">'+percentageSpent+'</span>'+'%<br>'+'<p>of your overall budget.</p>'
   		});
	}

	$scope.updateBars = function(currency, budget){
		previousBudgets.push(budget);
		$localstorage.setObject('previousBudgetss', previousBudgets);

		$scope.totalWidth = 0;

		$localstorage.set('budget', budget);
		$localstorage.set('currency', currency);

		if(previousBudgets.length > 1){
			var previousBudget  = previousBudgets[previousBudgets.length - 2];

			for(i = 0;i < $scope.selections.length; i++){
				var expenditure = ($scope.selections[i].width/100)*previousBudget;
				calcExpenditure(expenditure, budget);
				$scope.selections[i].width = $scope.progress;
			}
		}
	}

	function isInArray(value, array) {
  		return array.indexOf(value) > -1;
	}

	$scope.clearLocalStorage = function(){
		$localstorage.clear();
	}

})