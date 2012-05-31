load 'youtube.rb'

class ClipsController < ApplicationController
  def home
    @pageName = "Choose a Role"
    @pageDescription = ""
    unless params[:id].nil?
      flash[:notice] = "Transcript was successfully saved!"
    end
  end

  #GET /clips/admin/:id
  # this is how the admin gets more info about the clip
  def read
    @clip = Clip.find(params[:id])
    @pageName = "Video Info"
    @pageDescription = "for #{@clip.url}"
    # if @clip.nil? // what to do here?  
  end
  

  # GET /transcribe
  def show
    @clip = Clip.get_random_unfinished
    if @clip.nil?
      redirect_to :action => 'home', :notice => "No more videos to transcribe"  #flash notices?
    else 
      #@youtubeURL = Youtube.grab_single_url_filename(@clip.url)[:url] unless @clip.localFile THIS IS HOW TO GET THE YOUTUBE DOWNLOAD LINK
      render :show, :layout => 'transcribe'
    end
end

  def new
   @pageName = "Add to Queue"
   @pageDescription = "Queue the transcription of a new video."
   @clip = Clip.new 
   @urls = Clip.get_fresh_videos
  end
  
  def index
   @pageName = "The Admin's Home"
   @pageDescription = "A place to see the status of all the videos."
   @clips = Clip.all
  end

#is this supposed to be here or in the model? what goes in the model?
  def create
    params[:url] = params[:remoteurl] unless params[:remoteurl].nil?
    @clip = Clip.new(params[:clip])
    # path = File.expand_path("public/videos/" + @clip.url)
    # file = RVideo::Inspector.new(:file => path)
    ###### the lines above and below this  were commented to enable heroku use. 
    # @clip.length = file.duration
    
    @clip.localFile = !@clip.url.include?('/')
    @clip.status = false
    @clip.timestart = 0

    respond_to do |format|
    if @clip.save
      format.html  { redirect_to( :action => "index",
                    :notice => 'Clip was successfully created.') }
      format.json  { render :json => @clip,
                    :status => :created, :location => @clip }
    else
      format.html  { render :action => "new" }
      format.json  { render :json => @clip.errors,
                    :status => :unprocessable_entity }
    end end
  end  


  # this is the function called when the user presses "save transcript"
  def update
    clip = Clip.find(params[:id])
    if clip.store_segments(params[:JSON])
      send_data "OK"
    else
      send_data "NO"
    end
  end

  # destroys clip,
  # displays index view
  def destroy
    clip = Clip.find(params[:id])
    clip.destroy_segments
    clip.destroy
    File.delete("public/videos/#{clip.url}")
    redirect_to :action => 'index'
  end

  
  #this is to delete the table entry without deleting the file
  #concern: not DRY. how to refactor with the destroy function?
  def reset
    clip = Clip.find(params[:id])
    clip.destroy_segments
    clip.destroy
    redirect_to :action => 'index'
  end
  
  #GET /admin/clips/transcript/:id
  def transcript
    clip = Clip.find(params[:id])
    if clip.nil? || clip.status == false
      render :nothing => true
    else
      transcript = clip.get_transcript
      send_data transcript, :filename => "#{clip.url}-CSV.txt", :type => "text/plain"
    end
  end
      
end
