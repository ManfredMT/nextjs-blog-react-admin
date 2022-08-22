
import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

function getMonthSeries(posts) {
    const todayDateObject = new Date();
    const allTagsList = [];
    const allCategoriesList = [];
    const dateSeries = [];
    const postSeries = [];
    const tagSeries = [];
    const categorySeries = [];
    let tagStackNum = 0;
    let postStackNum = 0;
    let categoryStackNum = 0;
    const todayDate = todayDateObject.getDate();
  
    for(let i=0;i<=30;i+=2) {
      const windowStart = new Date();
      const windowEnd = new Date();
      windowStart.setDate(todayDate-31+i);
      windowStart.setHours(0,0,0,0);
      windowEnd.setDate(todayDate-30+i);
      windowEnd.setHours(0,0,0,0);
      dateSeries.push(`${windowEnd.getMonth()+1}.${windowEnd.getDate()}`);
      let windowPosts;
      if(i===0) {
        windowPosts = posts.filter((post)=>{
          const postDateClearTime = post.date.setHours(0,0,0,0);
          return postDateClearTime<=windowEnd;
        })
      }else {
        windowPosts = posts.filter((post)=>{
          const postDateClearTime = post.date.setHours(0,0,0,0);
          return windowStart<=postDateClearTime&&postDateClearTime<=windowEnd;
        })
      }
      for(let j=0;j<windowPosts.length;j++) {
        const post = windowPosts[j];
        postStackNum+=1;
        if(!allCategoriesList.includes(post.category)) {
          categoryStackNum+=1;
          allCategoriesList.push(post.category);
        }
        for(let k=0;k<post.tags.length;k++) {
          const tag = post.tags[k];
          if(!allTagsList.includes(tag)) {
            tagStackNum+=1;
            allTagsList.push(tag);
          }
        }
      }
      postSeries.push(postStackNum);
      categorySeries.push(categoryStackNum);
      tagSeries.push(tagStackNum);  
  
    }
    return {
      dateSeries,
      postSeries,
      categorySeries,
      tagSeries,
    }
  
  }

export default function useStackedLineChart(allPosts, echarts) {
    const chartsData = useMemo(()=>getMonthSeries(allPosts),[allPosts]);
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
    const chartOption = useMemo(()=>{return {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
          text: '博客动态'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          right: isTabletOrMobile?10:'10%',
          data: ['文章数', '分类数', '标签数']
        },
        
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: chartsData.dateSeries
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '文章数',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgb(1, 191, 236)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: chartsData.postSeries
          },
          {
            name: '分类数',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(0, 221, 255)'
                },
                {
                  offset: 1,
                  color: 'rgb(77, 119, 255)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: chartsData.categorySeries
          },
          {
            name: '标签数',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(55, 162, 255)'
                },
                {
                  offset: 1,
                  color: 'rgb(116, 21, 219)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: chartsData.tagSeries
          },
        ]
      }},[chartsData, echarts, isTabletOrMobile]);
      return {chartsData, chartOption};
}