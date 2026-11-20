class NotesController < ApplicationController
  def create
    @note = Note.new(note_params)
    if @note.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to root_path(anchor: "live-notes") }
      end
    else
      render turbo_stream: turbo_stream.replace("note_form", partial: "notes/form", locals: { note: @note }),
             status: :unprocessable_entity
    end
  end

  def destroy
    @note = Note.find(params[:id])
    @note.destroy
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.remove(@note) }
      format.html { redirect_back fallback_location: root_path }
    end
  end

  private
    def note_params
      params.expect(note: [ :body ])
    end
end
