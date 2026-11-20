# Rendered with layouts/admin, which links the "admin" entry
# (app/javascript/entrypoints/admin.ts + admin.css) instead of "application".
class AdminController < ApplicationController
  layout "admin"

  def index
    @notes = Note.latest
    @bundles = %w[application admin].to_h { |name| [ name, bundle_files(name) ] }
  end

  private
    def bundle_files(name)
      entry = RspackRails.manifest[name]
      return [] unless entry

      (entry.scripts + entry.stylesheets).map do |file|
        path = Rails.root.join("app/assets/builds", file)
        [ file, path.exist? ? path.size : nil ]
      end
    end
end
