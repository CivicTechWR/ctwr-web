# Jekyll plugin to ensure minified assets are copied to the site
Jekyll::Hooks.register :site, :post_write do |site|
  # Copy minified CSS files
  Dir.glob("css/*.min.css").each do |file|
    if File.exist?(file)
      dest = File.join(site.dest, file)
      FileUtils.mkdir_p(File.dirname(dest))
      FileUtils.cp(file, dest)
      puts "Copied #{file} to #{dest}"
    end
  end

  # Copy minified JS files
  Dir.glob("js/*.min.js").each do |file|
    if File.exist?(file)
      dest = File.join(site.dest, file)
      FileUtils.mkdir_p(File.dirname(dest))
      FileUtils.cp(file, dest)
      puts "Copied #{file} to #{dest}"
    end
  end
end
