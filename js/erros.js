const modal = (str) => {
    return `<div id="myModalError" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">ERRO</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p class='text-center'>${str}.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Sair</button>
        </div>
      </div>
    </div>
  </div>`
}

const showError = (message = "error") => {
  return modal(message)
}


export { showError }