class AddRelationidToSegments < ActiveRecord::Migration
  def self.up
    add_column :segments, :clip_id, :integer
  end

  def self.down
    remove_column :segments, :clip_id
  end
end
