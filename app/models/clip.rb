class Clip < ActiveRecord::Base
  has_many :segments
  belongs_to :movie
  
  def destroy_segments
    self.segments.each do |seg| seg.destroy end
  end

  #security concern in this process
  def store_segments(clipjson)
    cliphash = ActiveSupport::JSON.decode(clipjson) 
    clip_id = cliphash['clip_id']
    cliphash['segs'].each do |seg|
      Segment.create({ :clip_id => self.id,
                       :speaker => seg['speaker'],
                       :text => seg['text'],
                       :timestart => seg['timestart'],
                       :timeend => seg['timeend']
                     })
      end
      self.worker_time = cliphash['time_elapsed']  
    self.status = true
    return self.save
  end


  def self.get_random_unfinished
    pool = find_all_by_status(false);
    pool.sample
  end
  
  #display the files which do not yet have clips initialized.
  def self.get_fresh_videos
    dir_contents = Dir.entries("public/videos");   
    #build a hashset of the clip's urls                   O(n)
    filenames = Hash.new
    Clip.all.each do |c|
      filenames[c.url] = nil
    end
    #for each dir_content elem, ask is it in the hashset?    O(n)
    urls = Array.new
    dir_contents.each do |file|
         is_dotdot = file == '.' || file == '..'
         #is video = (some regex magic?)
         urls << file unless filenames.has_key?(file) || is_dotdot #&& is video
    end
    return urls
  end
 
  # CSV format
  # speaker,start,end,text
  def get_transcript()
    transcript = ""
    delimiter = "\t"
    self.segments.each do |seg|
      transcript << seg.speaker + delimiter
      transcript << Clip.format_time(seg.timestart) + delimiter
      transcript << Clip.format_time(seg.timeend) + delimiter
      transcript << seg.text + "\n"
    end
    return transcript
  end
  
  #take in a time in seconds
  #convert it to HH:MM:SS.mmm
  # examples: 21392
  # 21392 -> 5,,32
  def self.format_time(seconds)
      hours = seconds/60/60
      minutes = seconds/60 % 60
      seconds = seconds % 60
      time = Time.new(2000, 1, 1, hours, minutes, seconds)
      str = time.strftime("%k:%M:%S.%L")
  end
 
end
