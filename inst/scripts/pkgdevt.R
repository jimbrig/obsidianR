
#  ------------------------------------------------------------------------
#
# Title : obsidian R Package Development Script
#    By : Jimmy Briggs
#  Date : 2022-03-28
#
#  ------------------------------------------------------------------------

# library R packages ------------------------------------------------------

library(devtools)
library(usethis)
library(pkgbuild)
library(pkgload)
library(pkgdown)
library(testthat)
library(knitr)
library(pak)
library(purrr)
library(desc)
library(chameleon)
library(attachment)
library(templateeR)

# initialize package ------------------------------------------------------

usethis::create_package("obsidian")
usethis::use_namespace()
usethis::use_roxygen_md()
usethis::use_git()
usethis::use_tibble() # #' @return a [tibble][tibble::tibble-package]
# usethis::use_pipe()
# usethis::use_tidy_eval()
devtools::document()


# github ------------------------------------------------------------------

# set description and title first so included in GH repo
desc::desc_set(
  "Description" = "Analyze Obsidian Vaults.",
  "Title" = "Analyze Obsidian Vaults from R"
)

usethis::use_github(private = FALSE)

# github labels -----------------------------------------------------------

templateeR::use_gh_labels()


# docs --------------------------------------------------------------------

templateeR::use_git_cliff()
templateeR::use_git_cliff_action()

# package docs ------------------------------------------------------------

usethis::use_readme_rmd()
usethis::use_mit_license()
usethis::use_package_doc()
usethis::use_news_md()


# functions ---------------------------------------------------------------

c(
  # add function file names here:
  "plugins",
  "configs",
  "vaults"
) |> purrr::walk(usethis::use_r, open = FALSE)


# tests -------------------------------------------------------------------

c(
  # add function test file names here:
  "plugins"
) |> purrr::walk(usethis::use_test)

# data --------------------------------------------------------------------

c(
  # add data prep script names here:

) |> purrr::walk(usethis::use_data_raw)

# vignettes ---------------------------------------------------------------

c(
  # add vignette names here:
  "obsidian",
  "plugins"
) |> purrr::walk(usethis::use_vignette)


# data --------------------------------------------------------------------

c(
  "core-plugins"
) |>
  usethis::use_data_raw()

# templates ---------------------------------------------------------------

usethis::use_rmarkdown_template(
  template_name = "Obsidian Vault Analysis",
  template_description = "Perform an analysis of an Obsidian Vault.",
  template_create_dir = TRUE
)




