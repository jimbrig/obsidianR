vault_path <- fs::path_package("obsidian", "examples/testvault")
test_data_path <- fs::path_package("obsidian", "testdata")
core_plugins_test <- readLines(fs::path(test_data_path, "core_plugins"))
comm_plugins_test <- readLines(fs::path(test_data_path, "comm_plugins"))

test_that("retrieving core plugins works", {

  core_plugins <- get_core_plugins(vault_path)

  expect_equal(core_plugins, core_plugins_test)

})

test_that("retrieving community plugins works", {

  comm_plugins <- get_community_plugins(vault_path)

  expect_equal(comm_plugins, comm_plugins_test)

})

test_that("retrieving both core and community plugins works", {

  all_plugins <- get_plugins(vault_path)

  expect_type(all_plugins, "list")
  expect_named(all_plugins, c("core", "community"))
  expect_equal(all_plugins$core, core_plugins_test)
  expect_equal(all_plugins$community, comm_plugins_test)

})
