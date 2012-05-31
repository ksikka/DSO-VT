class MoviesController < ApplicationController
  # GET /movies
  # GET /movies.xml
  def index
    @movies = Movie.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @movies }
    end
  end

  # GET /movies/1
  # GET /movies/1.xml
  def show
    @movie = Movie.find(params[:id])
    @clips = @movie.clips.all
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @movie }
    end
  end

  # GET /movies/new
  # GET /movies/new.xml
  def new
    @movie = Movie.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @movie }
    end
  end

  # GET /movies/1/edit
  def edit
    @movie = Movie.find(params[:id])
  end

  # POST /movies
  # POST /movies.xml
  def create
    @movie = Movie.new(params[:movie])
    @movie.save

    respond_to do |format|
      if @movie.save 
        overlap = 4
        lengthClip = 30
        lengthMovie = @movie.length
        #how many pieces to divide it in?
        numPieces = (lengthMovie/lengthClip).ceil
        #length of each piece?
        clipLength = lengthClip/numPieces
        #add clips to movie
        0.upto(numPieces - 1) do |i|
          @movie.clips.create( :url => nil, #temporary
                               :timestart => i*clipLength - overlap/2, #to allow it to overlap
                               :length => clipLength + overlap/2,      #to allow it to overlap
                               :status => 0 )
        end
        #fix the first starts at 0 and the last ends at length
        firstClip = @movie.clips.first
        lastClip = @movie.clips.last
        firstClip.timestart = 0
        firstClip.length = clipLength
        lastClip.length = clipLength
        firstClip.save
        lastClip.save

        format.html { redirect_to(@movie, :notice => 'Movie was successfully created.') }
        format.xml  { render :xml => @movie, :status => :created, :location => @movie }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @movie.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /movies/1
  # PUT /movies/1.xml
  def update
    @movie = Movie.find(params[:id])

    respond_to do |format|
      if @movie.update_attributes(params[:movie])
        format.html { redirect_to(@movie, :notice => 'Movie was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @movie.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /movies/1
  # DELETE /movies/1.xml
  def destroy
    @movie = Movie.find(params[:id])
    @movie.destroy

    respond_to do |format|
      format.html { redirect_to(movies_url) }
      format.xml  { head :ok }
    end
  end
end
