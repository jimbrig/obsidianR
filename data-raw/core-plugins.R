

#  ------------------------------------------------------------------------
#
# Title : code to prepare `core-plugins` internal dataset
#    By : Jimmy Briggs
#  Date : 2022-03-28
#
#  ------------------------------------------------------------------------



plugins <- c(
  "Audio Recorder" = "audio-recorder",
  "Backlinks" = "backlink",
  "Command Palette" = "command-palette",
  "Daily Notes" = "daily-notes",
  "File Explorer" = "file-explorer",
  "File Recovery" = "file-recovery",
  "Graph View" = "graph",
  "Markdown Format Converter" = "markdown-importer",
  "Note Composer" = "note-composer",
  "Open in Default App" = "open-with-default-app",
  "Outgoing Links" = "outgoing-link",
  "Outline" = "outline",
  "Page Preview" = "page-preview",
  "Quick Switcher" = "switcher",
  "Random Note" = "random-note",
  "Search" = "global-search",
  "Slides" = "slides",
  "Starred Notes" = "starred",
  "Tag Pane" = "tag-pane",
  "Templates" = "templates",
  "Word Count" = "word-count",
  "Workspaces" = "workspaces",
  "Zettelkasten Prefixer" = "zk-prefixer",
  "Publish" = "publish", # https://help.obsidian.md/Obsidian+Publish/Introduction+to+Obsidian+Publish
  "Sync" = "sync", # https://help.obsidian.md/Obsidian+Sync/Introduction+to+Obsidian+Sync
  "Slash Command" = "slash-command",
  "Editor Status" = "editor-status"
)

plugins_formatted <- gsub("-", " ", stringr::str_to_title(all_possible_plugins))

urls <- paste0("https://publish.obsidian.md/help/Plugins/",
               gsub("-", "+", all_possible_plugins))

descs <- c(

)

core_plugins <- tibble::tibble(
  plugin = all_possible_plugins,
  name = plugins_formatted,
  description =
)


usethis::use_data(core - plugins, overwrite = TRUE)
