class PagesController < ApplicationController
  def home
    @entry = RspackRails.manifest["application"]
    @dev_server = RspackRails.dev_server.running?
    @notes = Note.latest
  end

  def how
  end

  # Loaded into a lazy <turbo-frame> on the home page.
  def stats
    @booted_at = Rails.application.config.booted_at
  end
end
