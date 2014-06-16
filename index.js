var fs = require('fs'),
	jsdom = require("jsdom"),
	PaginationParser = require('./parsers/pagination.js'),
	CategoriesParser = require('./parsers/categories.js'),
	CategoryParser = require('./parsers/category.js'),
	categoriesList = [],
	currentPageIndex = 1,
	totalCategoriesPages = 0,
	jquery = fs.readFileSync("./utils/jquery.js", "utf-8");

jsdom.env({

	url: 'http://anitube.xpg.uol.com.br/categories',

	scripts: [jquery],

	done: function (errors, window) {
		var $ = window.$,
			categoriesBot;

		totalCategoriesPages = PaginationParser.pages($);

		categoriesBotOnEnd = function () {
			var curentIndex = 0,
				len = categoriesList.length,
				getVideosFromCategory;

			console.log('data exported to: ./data/categories.json');
			fs.writeFileSync('./data/categories.json', JSON.stringify(categoriesList, null, 4));

			getVideosFromCategory = function () {
				if (curentIndex < len) {
					CategoryParser.get(jsdom, categoriesList[curentIndex], function () {
						categoriesList[curentIndex] = null; // Descarta item da memoria
						curentIndex += 1;
						getVideosFromCategory();
					});
				} 
				// else {
				// 	console.log('data exported to: ./data/categories_and_videos.json');
				// 	fs.writeFileSync('./data/categories.json', JSON.stringify(categoriesList, null, 4));
				// }
			};

			getVideosFromCategory();
		};

		categoriesBot = function () {
			CategoriesParser.get(jsdom, currentPageIndex, function (results) {
				console.log('[extracting categories] page: ' + currentPageIndex + ', categories found: ' + results.length);
				categoriesList = categoriesList.concat(results);

				// Se ainda possuir paginas a serem analisadas executa o bot para a proxima pagina
				if ((currentPageIndex + 1) <= totalCategoriesPages) {
					currentPageIndex += 1;
					categoriesBot();
				} else {
					categoriesBotOnEnd();
				}
			});	
		};

		window.close();

		// Runs the bagaça
		categoriesBot();
	}
});