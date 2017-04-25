# Install (if not installed) + load dplyr package 
library(dplyr)

# Set your working directory to the appropriate project folder
setwd("~/INFO474/homework/a2-data-exploration/data")

smoking.prev <- read.csv("SMOKING_PREVALENCE_1996_2012.csv", stringsAsFactors = FALSE) %>% 
  filter(county == '', state != 'National') %>% 
  select(state, sex, year, total_mean, daily_mean)

colnames(smoking.prev) <- c('state', 'sex', 'year', 'total', 'daily')

write.csv(smoking.prev, 'prepped_prev_data.csv', row.names = FALSE)