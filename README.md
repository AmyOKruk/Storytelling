# Which countries like the same music? 

### I used Spotify's top 200 song charts to compare which countries listen to the same songs

To collect the data, I scraped Spotify’s Top 200 songs per country for the week of 06/21/2019 to 06/28/2019.

To create the correlation matrix, I calculated the jaccard index of different top 200 song lists. I used a clustermap method to hierarchically order the data by similarity and then by continent.

One limitation of this analysis is that the data represents a single week, offering us a snapshot of trends. More concrete observations could be made if the data represented a larger time period. Spotify’s top song charts also heavily favour countries from North America and Europe. While I included every available country, nearly all of Africa and many parts of Asia are not represented here.

To see the article, <a href='https://amyokruk.github.io/Storytelling/'>click here</a>. 
