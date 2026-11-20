Rails.application.routes.draw do
  root "pages#home"
  get "how" => "pages#how"
  get "up" => "rails/health#show", as: :rails_health_check
end
