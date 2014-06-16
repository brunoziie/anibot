/**
 * Retorna o numero de paginas totais
 * @param  {Object} $ Objeto de contexto do jQuery 
 * @return {Integer}  Numero de paginas
 */
exports.pages = function ($) {

	var $pagination = $('#pagination-flickr'),
		pages = 1;


	$pagination.find('li').each(function () {
		var $this = $(this);

		if ($this.text().match(/\d/) !== null) {
			pages = parseInt($this.text(), 10);
		}
	});	

	return pages;
}