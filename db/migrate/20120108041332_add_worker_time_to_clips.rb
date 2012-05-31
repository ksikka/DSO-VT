class AddWorkerTimeToClips < ActiveRecord::Migration
  def self.up
    add_column :clips, :worker_time, :integer
  end

  def self.down
    remove_column :clips, :worker_time
  end
end
