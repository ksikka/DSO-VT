class AddRelationidToClips < ActiveRecord::Migration
  def self.up
    add_column :clips, :movie_id, :integer
  end

  def self.down
    remove_column :clips, :movie_id
  end
end
