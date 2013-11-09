class Appointment < ActiveRecord::Base
  attr_accessible :day, :description, :month, :time, :year
end
