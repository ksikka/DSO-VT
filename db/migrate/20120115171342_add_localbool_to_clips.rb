class AddLocalboolToClips < ActiveRecord::Migration
  def self.up
    add_column :clips, :localFile, :boolean
  end

  def self.down
    remove_column :clips, :localFile
  end
end
