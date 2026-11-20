# Pushes a few numbers from the Rails process once a second to every
# subscriber (app/javascript/controllers/live_controller.ts).
class MetricsChannel < ApplicationCable::Channel
  periodically every: 1.second do
    transmit({
      at: Time.current.strftime("%H:%M:%S"),
      rss_mb: rss_mb,
      threads: Thread.list.size,
      connections: ActionCable.server.connections.size,
      notes: Note.count
    })
  end

  private
    def rss_mb
      kb = if File.exist?("/proc/self/status")
        File.read("/proc/self/status")[/VmRSS:\s+(\d+)/, 1].to_i
      else
        `ps -o rss= -p #{Process.pid}`.to_i
      end
      (kb / 1024.0).round(1)
    end
end
