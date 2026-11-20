class Note < ApplicationRecord
  KEEP = 20

  validates :body, presence: true, length: { maximum: 80 }

  # Every open tab subscribed with turbo_stream_from "notes" gets these over
  # Action Cable. The tab that posted also gets the controller's own stream;
  # Turbo replaces an element with the same id instead of adding it twice.
  after_create_commit -> { broadcast_prepend_to "notes", target: "notes" }
  after_destroy_commit -> { broadcast_remove_to "notes" }

  # The demo is public: keep only the latest few.
  after_create_commit -> { Note.where.not(id: Note.order(id: :desc).limit(KEEP).select(:id)).destroy_all }

  scope :latest, -> { order(id: :desc).limit(KEEP) }
end
