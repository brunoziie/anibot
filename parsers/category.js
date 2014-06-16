var VideosParser = require('./videos.js'),
	PaginationParser = require('./pagination.js'),
	fs = require('fs'),
	jquery = fs.readFileSync("../utils/jquery.js", "utf-8");

/**
 * Retorna as categorias listadas em uma pagina
 * @param  {Object}   jsdom    Instancia do JSDOM
 * @param  {Number}   page     Numero da pagina
 * @param  {Function} callback Callback para os resultados
 * @return {void}
 */
exports.get = function (jsdom, category, callback) {
	var pagesNum = 1,
		currentPageIndex = 1,
		videosList = [],
		parseURL;

	parseURL = function (url, page) {
		var parts, lastItem, len;
		if (page === 1) return url;

		parts = url.split('/');
		len = parts.length;
		lastItem = parts[len - 1];

		parts[len - 1] = page;
		parts.push(lastItem);
		return parts.join('/');
	};

	jsdom.env({

		url: parseURL(category.url, pagesNum),

		scripts: [jquery],

		done: function (errors, window) {
			var $ = window.$,
				videoBot,
				videoBotOnEnd;

			category.description = $('p.catDesc').text();
			pagesNum = PaginationParser.pages($);

			console.log('getting videos from: ' + category.title);

			videoBot = function () {
				var url = parseURL(category.url, currentPageIndex);

				VideosParser.get(jsdom, url, function (videos) {
					videosList = videosList.concat(videos);

					// Se ainda possuir paginas a serem analisadas executa o bot para a proxima pagina
					if ((currentPageIndex + 1) <= pagesNum) {
						currentPageIndex += 1;
						videoBot();
					} else {
						videoBotOnEnd();
					}
				});
			};

			videoBotOnEnd = function () {
				var filename = "./data/categories/" + category.id + ".json";

				category.videos = videosList;
				fs.writeFileSync(filename, JSON.stringify(category, null, 4));

				category = null;

				console.log('data exported to: ' + filename);
				callback();
			};

			window.close();

			// Runs the bagaça
			videoBot();
		}
	});
};