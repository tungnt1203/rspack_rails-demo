# Renders with app/views/layouts/admin.html.erb, which loads the admin entry
# point (app/javascript/entrypoints/admin.ts) instead of application.
class AdminController < ApplicationController
  layout "admin"

  def index
    @entries = RspackRails::Entrypoints.discover(Rails.root)
  end
end
