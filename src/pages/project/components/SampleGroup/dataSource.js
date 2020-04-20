 const tableData1 = [
   // 第一个分组方案
   {
     "groupSchemeName": "groupingscheme1",
     "sampleList": null, // sampleList为null，表示这个分组方案里都是组， 需要遍历groupList(在下面)
     "groupList": [{
         "groupName": "group1",
         "groupColour": "blue",
         // 组里面包含的样品列表
         "sampleList": [{
           "metadataSampleId": "db820c4a2a15401f95943594f58b1084",
           "sampleAlias": "别名001"
         }]
       },
       {
         "groupName": "group2",
         "groupColour": "red",
         "sampleList": [{
           "metadataSampleId": "b6545cf90ce340d8aa0c464f2fd422b7",
           "sampleAlias": "别名002"
         }]
       },
       {
         "groupName": "group3",
         "groupColour": "gray",
         "sampleList": [{
           "metadataSampleId": "f98db018780144c1aec7444bf0a25622",
           "sampleAlias": "别名003"
         }]
       }
     ]
   },
   // 第二个分组方案
   {
     "groupSchemeName": "groupingscheme2",
     "sampleList": [{
         "metadataSampleId": "db820c4a2a15401f95943594f58b1084",
         "sampleAlias": "别名001"
       },
       {
         "metadataSampleId": "b6545cf90ce340d8aa0c464f2fd422b7",
         "sampleAlias": "别名002"
       },
       {
         "metadataSampleId": "f98db018780144c1aec7444bf0a25622",
         "sampleAlias": "别名003"
       }
     ],
     "groupList": null
   }
 ]


 function column2row(data) {
   const header = [];
   const tableData = [];
   for (let i = 0; i < data.length; i++) {
     const column = data[i];
     const h = {
       groupSchemeName: column.groupSchemeName,
       type: column.sampleList ? 'sampleList' : 'groupList'
     }

     header.push(h)

     const row = column.groupList || column.sampleList;

     for (let j = 0; j < row.length; j++) {
       if (!tableData[j]) {
         tableData[j] = [];
       }
       tableData[j][i] = data[i][h.type][j]
     }
   }

   return {
     header,
     rows: tableData
   }
 }

 console.log(column2row(tableData1))

 //  const headers = [];
 //  const rows = []
 //  tableData.forEach(item => {
 //    headers.push(item.groupSchemeName);
 //    if (item.sampleList) {
 //      item.sampleList.forEach(samp => {
 //        rows.push({
 //          ...samp,
 //          groupName: '当前样品',

 //        })
 //      })

 //    } else {
 //      item.groupList.forEach(group => {
 //        group.sampleList.forEach(samp => {
 //          rows.forEach(item => {
 //            if (samp.metadataSampleId !== item.metadataSampleId) {
 //              rows.push({
 //                ...samp,
 //                //  groupName: group.groupName
 //              })
 //            }
 //          })
 //          //  isIncludes = rows.includes(samp)
 //          //  if (!isIncludes) {
 //          //    rows.push(samp)
 //          //  }
 //        })
 //      })

 //    }


 //  })

 //  console.log(rows);
