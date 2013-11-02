Hw::Application.routes.draw do
  root :to => 'pages#home'  
  get '/pages/project_2', to: 'pages#project_2'
  get '/calendar', to: 'pages#calendar'
end
