Rails.application.routes.draw do
  root "pages#home"
  get "admin" => "admin#index"

  get "up" => "rails/health#show", as: :rails_health_check
end
