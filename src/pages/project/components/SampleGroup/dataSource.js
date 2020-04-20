 const tableData = [
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
