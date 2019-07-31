const loader = () => {
	return `
		<div id="modalLoader" class="modal" tabindex="-1" role="dialog">
		    <div class="modal-dialog" role="document">
		      <div class="modal-content">
		        <div class="modal-header">
		          <h5 class="modal-title">Carregando...</h5>
		        </div>
		        <div class="modal-body-loader">
		          <div class='loader' id='loader'></div>  
		        </div>
		      </div>
		    </div>
  		</div>
	`
}


export { loader }