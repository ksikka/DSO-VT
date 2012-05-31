class CreateSegments < ActiveRecord::Migration
  def self.up
    create_table :segments do |t|
      t.integer :timestart
      t.integer :timeend
      t.string :speaker
      t.text :text

      t.timestamps
    end
  end

  def self.down
    drop_table :segments
  end
end
