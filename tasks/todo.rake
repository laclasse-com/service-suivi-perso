# to do Task
desc 'show a todolist from all the TODO tags in the source'
task :todo do
  underyellow = "\e[4;33m%s\e[0m"
  underred    = "\e[4;31m%s\e[0m"
  undergreen  = "\e[4;32m%s\e[0m"
  undercolor = ''

  color = ''

  Dir.glob('{api,config,lib,model,public,spec}/**/*.{rb,xhtml,js}') do |file|
    lastline = todo = comment = long_comment = false

    File.readlines(file).each_with_index do |line, lineno|
      lineno += 1
      comment      = line =~ %r{^\s*?[#\/].*?$}
      long_comment = line =~ /^=begin/
      long_comment = line =~ /^=end/

      todo = true if line =~ /TODO|FIXME|THINK/ & (long_comment || comment)
      todo = false if line.delete('#').strip.empty?
      todo = false unless comment || long_comment

      undercolor = underyellow if line =~ /TODO/
      undercolor = underred    if line =~ /FIXME/
      undercolor = undergreen  if line =~ /THINK/

      color = undercolor.tr('4', '0')

      next unless todo
      unless lastline && lastline + 1 == lineno
        puts
        puts undercolor % "#{file}# #{lineno} : "
      end

      l = '  . ' + line.strip.gsub(/^#\s*/, '')
      # print '  . ' unless l =~ /^-/
      puts color % l
      lastline = lineno
    end # File.readlines
  end
end # task :todo
