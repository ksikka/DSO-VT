DSO::Application.routes.draw do
  
  root :to => 'clips#home'
  
  scope "/admin" do
    root :to => redirect('/admin/clips') #just to provide a default action. may be changed.
    match 'clips/new' => 'clips#new'
    match 'clips/:id' => 'clips#read'
    match 'clips/:id/reset' => 'clips#reset'
    match 'clips/transcript/:id' => 'clips#transcript'
    resources :clips
  end

  match "transcribe" => 'clips#show'
  match 'clips/:id/update' => 'clips#update'
  resources :clips

  match "/success/:id" => 'clips#home'
  
  
end
