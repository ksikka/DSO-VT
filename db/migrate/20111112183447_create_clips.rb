class CreateClips < ActiveRecord::Migration
  def self.up
    create_table :clips do |t|
      t.string :url
      t.integer :timestart
      t.integer :length
      t.boolean :status

      t.timestamps
    end
  end

  def self.down
    drop_table :clips
  end
end
