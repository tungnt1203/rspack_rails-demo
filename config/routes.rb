Rails.application.routes.draw do
  root "pages#home"
  get "how" => "pages#how"
  get "stats" => "pages#stats"
  get "admin" => "admin#index"
  resources :notes, only: %i[create destroy]
  get "up" => "rails/health#show", as: :rails_health_check
end
