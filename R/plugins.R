
#' Get Plugins
#'
#' @description
#' Retrieve details regarding an Obsidian Vault's utilized plugins, both core
#' and community.
#'
#' @param vault_path Path to the Obsidian Vault's root-level directory.
#' @param ... Not used
#'
#' @return Returns a list of character vectors for both "core" and "community"
#'  plugins.
#'
#' @export
#'
#' @importFrom jsonlite read_json
#' @importFrom fs path
#'
#' @examples
#' \dontrun{
#'
#'  # get plugins from a vault
#'  vault_path <- "path/to/my/vault"
#'  get_plugins(vault_path)
#'
#' }
get_plugins <- function(vault_path, ...) {

  core_plugins <- get_core_plugins(vault_path)
  comm_plugins <- get_community_plugins(vault_path)

  list(
    "core" = core_plugins,
    "community" = comm_plugins
  )

}


#' @describeIn get_plugins Get Core Obsidian Plugins
get_core_plugins <- function(vault_path, ...) {

  json_file <- fs::path(vault_path, ".obsidian", "core-plugins.json")
  jsonlite::read_json(json_file, TRUE)

}

#' @describeIn get_plugins Get Community Obsidian Plugins
get_community_plugins <- function(vault_path, ...) {

  json_file <- fs::path(vault_path, ".obsidian", "community-plugins.json")
  jsonlite::read_json(json_file, TRUE)

}
