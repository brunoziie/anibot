var jquery = fs.readFileSync("../utils/jquery.js", "utf-8");
/**
 * Retorna as categorias listadas em uma pagina
 * @param  {Object}   jsdom    Instancia do JSDOM
 * @param  {Number}   page     Numero da pagina
 * @param  {Function} callback Callback para os resultados
 * @return {void}
 */
exports.get = function (jsdom, page, callback) {
	jsdom.env({

		url: 'http://anitube.xpg.uol.com.br/categories/page/' + page,

		scripts: [jquery],

		done: function (errors, window) {
			var $ = window.$,
				categories = [];

			$('.mainBox .mainList').each(function () {
				var $this = $(this),
					$title = $this.find('.catTitle a');

				categories.push({
					id: $title.attr('href').split('/')[4],
					title: $title.text(),
					url: $title.attr('href'),
					thumb: $this.find('.videoThumb img').attr('src')
				});
			});

			window.close();
			callback(categories);
		}
	});
};