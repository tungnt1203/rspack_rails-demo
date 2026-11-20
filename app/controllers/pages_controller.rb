class PagesController < ApplicationController
  def home
    @entry = RspackRails.manifest["application"]
    @dev_server = RspackRails.dev_server.running?
  end

  def how
  end
end
