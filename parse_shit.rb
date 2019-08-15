# load team info map
require 'json'

def get_week_number(line)
  line.split(' ')[4].to_i
end

def get_matchup(line)
  tab_split = line.split("\t")

  date = tab_split[0]
  fav = tab_split[1].strip
  line = tab_split[2].to_f
  dog = tab_split[3].strip
  
  home_team = ''
  away_team = ''

  if is_home_fav = !fav.split(' ').index('At').nil?
    home_team = fav.sub('At ', '')
    away_team = dog
  elsif is_home_dog = !dog.split(' ').index('At').nil?
    home_team = dog.sub('At ', '')
    away_team = fav
    line = -line
  else 
    # London game or something, just make fav the "home team"
    home_team = fav
    away_team = dog
  end
    

  {
    'home' => home_team.sub(" ", ""),
    'away' => away_team.sub(" ", ""), 
    'line' => line, 
    'game_time' => date,
    'game_over' => false,
    'home_score' => 0,
    'away_score' => 0
  }  
end

def get_picks(line)
  picks = []
  line.split[1..-1].each do |team|
    underdog_index = team.index(".u")
    if underdog_index
      picks << team[0...underdog_index]
    else 
      picks << team
    end
  end
  picks
end

raise "Requires season year and week to parse" if ARGV.length != 2
year = ARGV[0]
week = ARGV[1]

path = "/mnt/c/Users/Isamu/Documents/picks/#{year}/Week#{week}.txt" # /year/WeekX.txt
raise "Missing picks file for year #{year} and week #{week}" unless File.exists?(path)

line_counter = 0
matchup_counter = 1 
week_number = 0

matchup_list = []
my_picks = []
dad_picks = []

File.open(path).each do |line|
  if line_counter == 0
    week_number = get_week_number line
  elsif line.index('ME')
    my_picks = get_picks(line)
  elsif line.index('DAD')
    dad_picks = get_picks(line)
  elsif line.index('Tie')
  elsif line_counter > 2 && line.split("\t").size >= 4 
    matchup = get_matchup(line)
    matchup["id"] = matchup_counter
    matchup_list << matchup
    matchup_counter += 1
  end
  line_counter += 1
end

if week_number == 0
  raise "Failed to parse week number from file"
elsif matchup_list.empty?
  raise "Failed to parse any matchups"
end

puts "Week number: #{week_number}"
puts matchup_list
File.open("./picks/data/#{year}/Week#{week_number}_games.json", 'w') do |file|
  file.write JSON.pretty_generate(matchup_list)
end

puts "My picks: #{my_picks}"
puts "Dad picks: #{dad_picks}"

picks = {"me" => my_picks, "dad" => dad_picks}

File.open("./picks/data/#{year}/Week#{week_number}_picks.json", 'w') do |file|
  file.write JSON.pretty_generate(picks)
end
