function makeRequest(url, callback) {
var request;
if (window.XMLHttpRequest) {
request = new XMLHttpRequest(); // IE7+, Firefox, Chrome, Opera, Safari
} else {
request = new ActiveXObject("Microsoft.XMLHTTP"); // IE6, IE5
}
request.onreadystatechange = function() {
if (request.readyState == 4 && request.status == 200) {
callback(request);
}
}
request.open("GET", url, true);
request.send();
}
//var dataurl=window.location.origin+'/portal-hfr/web/';
function showAfterClick() {
         return '<i class="icon-spinner icon-spin icon-3x"></i>';
     }
 window.onload = function() {
         $('#backbutton').hide(0);
         viewNationalMap();
         showDefaultFacilityByLevel();
         showDefaultFacilityByOwnership();
         showDefaultFacilityOperatingByRegion();
     };
$("#backbutton").click(function(){
        viewNationalMap();
        showDefaultFacilityByLevel();
        showDefaultFacilityByOwnership();
        showDefaultFacilityOperatingByRegion();
        $('#backbutton').hide(0);
    });

$(".map-print").click(function () {
    printFacilitiesMap();
});

function printFacilitiesMap() {
    const $body = $('body');
    const $mapContainer = $('.fadeCustomer');
    const $mapContainerParent = $mapContainer.parent();
    const $printContainer = $('<div style="position:relative; width: 1000px;">');

    $printContainer.height($mapContainer.height()).append($mapContainer).prependTo($body);
    const $content = $body.children().not($printContainer).not('script').detach();

    /**
     * Needed for those who use Bootstrap 3.x, because some of
     * its `@media print` styles ain't play nicely when printing.
     */
    const $patchedStyle = $('<style media="print">')
        .text(`
          img { max-width: none !important; }
          a[href]:after { content: ""; }
        `).appendTo('head');

    window.print();

    $body.prepend($content);
    $mapContainerParent.prepend($mapContainer);

    $printContainer.remove();
    $patchedStyle.remove();
}

$(".download-map").click(function () {
    downloadFacilitiesMap();
});

function downloadFacilitiesMap() {
    html2canvas($('#download'),
        {
            onrendered: function (canvas) {
                var a = document.createElement('a');
                // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
                a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
                a.download = 'image.jpg';
                a.click();
            }
        });
}

  function viewNationalMap(){
        var dataurl=window.location.origin+'/portal-hfr/web/';
        $.getJSON('js/special/Region.geojson', function (geojson) {
            makeRequest(dataurl+'index.php?r=site/facility-operating', function(data2) {
            var data = JSON.parse(data2.responseText);
                Highcharts.mapChart('divmap', {
                chart: {
                    map: geojson,
                },

                title: {
                    text: 'Operating Health Facilities in Tanzania Main Land'
                },

                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'top'
                    }
                },
                plotOptions: {
                    map: {
                        states: {
                            hover: {
                                color: '#EEDD66'
                            }
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#ffffff',
                    borderWidth: 0,
                    shadow: false,
                    useHTML: true,
                    padding: 0,
                    pointFormat: '<span style="font-size:13px"> {point.properties.Region_Nam} Region: {point.value}</span>'
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'middle'
                },
                colorAxis: {
                    min: 0,
                    minColor: '#E6E7E8',
                    maxColor: '#005645'
                },
                credits: {
                    enabled: false
                },


                series: [{
                    data: data,
                    keys: ['Region_Nam','value'],
                    joinBy: 'Region_Nam',
                    name: 'Total Facilities',
                    dataLabels: {
                        enabled: true,
                        format: '{point.properties.Region_Nam}<br/><span style="font-size:14px;">{point.value}</span>'
                    },

                    point:{
                        events:{
                            click: function(){
                                //chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>');
                                //showAfterClick();                                
                                viewSelectedRegion(this.Code,this.Region_Nam,dataurl);
                            },

                        }
                    }
                }]

            });
          });
        });
  }


    function viewSelectedRegion(Code,Region_Nam,dataurl){

        makeRequest(dataurl+'index.php?r=site/facility-operating&Code='+Code, function(data1) {
        var data2 = JSON.parse(data1.responseText);
        var path = "js/special/region/";
        file = Code.concat(".geojson");
        full_path = path.concat(file);
                $.getJSON(full_path, function (geojson) {
                    

                    Highcharts.mapChart('divmap', {
                        chart: {
                            map: geojson                            
                        },
                        
                        title: {
                            text: 'Operating Health Facilities in '+Region_Nam
                        },
                        subtitle: {
                            text: ""
                        },
                        
                        legend: {
                            layout: 'vertical',
                            align: 'left',
                            verticalAlign: 'middle'
                        },
                        colorAxis: {
                            min: 1,
                            minColor: '#E6E7E8',
                            maxColor: '#005645'
                        },
                        
                        mapNavigation: {
                            enabled: true,
                            buttonOptions: {
                                verticalAlign: 'top',
                                align: 'left'
                            }
                        },
                        plotOptions: {
                            map: {
                                states: {
                                    hover: {
                                        color: '#a4edba'
                                    }
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: '#ffffff',
                            borderWidth: 0,
                            shadow: false,
                            useHTML: true,
                            padding: 0,
                            pointFormat: '<span style="font-size:13px"> {point.properties.District_N} :{point.value}</span>'
                        },
                        credits: {
                            enabled: false
                        },
                        
                        series: [{
                            data: data2,
                            keys: ['Code','District_N','value'],
                            joinBy: 'Code',
                            name: 'Total Facilities',
                            dataLabels: {
                                enabled: true,
                                format: '{point.properties.District_N}<br/><span style="font-size:14px;">{point.value}</span>'
                            },
                            point:{
                                events:{
                                    click: function(){
                                      
                                        $('#googleMapModal').modal('show');
                                                                          
                                        viewinGoogleMap(this.Code,this.District_N,dataurl)
                                    }
                                }
                            }
                        }]
                        
                    });
                    
                });
                
                $('#backbutton').show();
                viewFacilityByLevelSelectedRegion(Code,Region_Nam,dataurl);
                viewFacilityByOwnershipSelectedRegion(Code,Region_Nam,dataurl);
                viewFacilityOperatingBySelectedRegion(Code,Region_Nam,dataurl);

      });

    }
    function viewinGoogleMap(Code,District_N,dataurl){
        var path = "js/special/council/";
        file = Code.concat(".geojson");
        full_path = path.concat(file);

                makeRequest(dataurl+"index.php?r=site/facility-operatingbycouncil&Code="+Code, function(dataC) {
                var result = JSON.parse(dataC.responseText);
                var locations = result.facilities_list;
                $.each(locations, function(i, item) {
                    lati = item.latitude;
                    longi = item.longitude;
                    return false;
                });

                var modalTitle = "Operating Facilities in ".concat(District_N);

                $('#myModalLabel').text(modalTitle);


                var lati,longi;

                $.each(locations, function(i, item) {
                    lati = item.latitude;
                    longi = item.longitude;
                    return false;
                });

                var map = new google.maps.Map(document.getElementById('googleMap'), {
                    zoom: 9,
                    center: new google.maps.LatLng(lati, longi),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                map.data.loadGeoJson(full_path);
                map.data.setStyle(function(feature) {
                var color = "white";
                return {
                  fillColor: color,
                  strokeWeight: 0.5
                }
              });

                var infowindow = new google.maps.InfoWindow();

                var marker;
                $.each(locations, function(i, item) {

                    if (item.ownership_category=="Public"){
                        var labels="";
                    }
                    if (item.ownership_category=="Private"){
                        var labels="";
                    }

                  /*
                    if (item.ownership_category=="Public"){
                        var icon = {
                            //url: dataurl+"/images/svgs/map/hospital2.png",
                            url: "http://maps.google.com/mapfiles/ms/micons/brown.png",
                            scaledSize: new google.maps.Size(30, 40),
                        };
                    }
                    if (item.ownership_category=="Private"){
                        var icon = {
                            //url: "http://maps.google.com/mapfiles/ms/micons/green.png",
                            url: "http://maps.google.com/mapfiles/ms/micons/blue.png",
                            scaledSize: new google.maps.Size(40, 40),
                        };
                    }
                   */
                  if (item.code=="DSP"){
                        var icon = {
                            url: dataurl+"/images/svgs/map/new5.png",
                            //url: "http://maps.google.com/mapfiles/ms/micons/brown.png",
                            scaledSize: new google.maps.Size(30, 30),
                        };
                        document.getElementById('datanew5').style.display = "block";
                    }
                    if (item.code=="HLCTR"){
                        var icon = {
                            url: dataurl+"/images/svgs/map/new3.png",
                            //url: "http://maps.google.com/mapfiles/ms/micons/brown.png",
                            scaledSize: new google.maps.Size(30, 30),
                        };
                        document.getElementById('datanew3').style.display = "block";
                    }
                    if (item.code=="HOSP"){
                        var icon = {
                            url: dataurl+"/images/svgs/map/new4.png",
                            //url: "http://maps.google.com/mapfiles/ms/micons/brown.png",
                            scaledSize: new google.maps.Size(30, 30),
                        };
                        document.getElementById('datanew4').style.display = "block";
                    }
                    if (item.code=="LABS"){
                        var icon = {
                            url: dataurl+"/images/svgs/map/new6.png",
                            //url: "http://maps.google.com/mapfiles/ms/micons/brown.png",
                            scaledSize: new google.maps.Size(30, 30),
                        };
                        document.getElementById('datanew6').style.display = "block";
                    }
                    if (item.code=="CLNC"){
                        var icon = {
                            url: dataurl+"/images/svgs/map/new7.png",
                            //url: "http://maps.google.com/mapfiles/ms/micons/brown.png",
                            scaledSize: new google.maps.Size(30, 30),
                        };
                        document.getElementById('datanew7').style.display = "block";
                    }
                    if(item.code=='MAT_HOME' || item.code=='MAT_NUR' || item.code=='NUR_HOME'){
                        var icon = {
                            url: dataurl+"/images/svgs/map/new1.png",
                            //url: "http://maps.google.com/mapfiles/ms/micons/brown.png",
                            scaledSize: new google.maps.Size(30, 30),
                        };
                        document.getElementById('datanew1').style.display = "block";
                    }
                    if(item.code !='MAT_HOME' && item.code !='MAT_NUR' && item.code !='NUR_HOME' && item.code !='CLNC' && item.code !='HOSP' && item.code !='LABS' && item.code !='DSP' && item.code !='HLCTR'){
                        var icon = {
                            url: dataurl+"/images/svgs/map/new2.png",
                            //url: "http://maps.google.com/mapfiles/ms/micons/brown.png",
                            scaledSize: new google.maps.Size(30, 30),
                        };
                        document.getElementById('datanew2').style.display = "block";
                    }
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(item.latitude, item.longitude),
                        label: labels,
                        icon: icon,
                        map: map
                    });

                    google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
                        return function() {
                            infowindow.setContent(item.facility_name+' '+item.facility_type);
                            infowindow.open(map, marker);
                        }
                    })(marker, i));




                    //add facility details
                    google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            var ownership_details=item.ownership_details;
                            if(ownership_details !=null){
                              var generalOwnership= item.ownership+' | '+item.ownership_details;
                            }else{
                              var generalOwnership= item.ownership;
                            }
                            var facility_id=item.id;
                            $('#registered_name').text(item.facility_name== null ? "" :item.facility_name);
                            $('#facility_type').text(item.facility_type== null ? "" :item.facility_type);
                            $('#facility_ownership').text(item.ownership== null ? "" :generalOwnership);
                            $('#facility_location').text(item.Ward == null ? "" :'Ward: '+item.Ward+' | Village/Mtaa: '+item.Village_Mtaa);
                            $('#registration_status').text(item.registration_status== null ? "" :item.registration_status);
                            $('#operating_status').text(item.operating_status== null ? "" :item.operating_status);
                            $('#phone_number').text(item.phone_number== null ? "" :item.phone_number);
                            $('#email_address').text(item.email== null ? "" :item.email);
                            $('#website').text(item.website== null ? "" :item.website);
                            //console.log("Markers: ", item.website);
                            //service data provider
                            makeRequest(dataurl+"index.php?r=site/facility-serviceslist&facility_id="+facility_id, function(dataServices) {
                var resultServiceList = JSON.parse(dataServices.responseText);
                var facility_servicesList=resultServiceList.facility_services;
                var facility_staffcadreList=resultServiceList.facility_staffcadre;

                     //alert(dataServices.responseText);
                     var categoryG="";var staffCadreGeneral="";
                     var service_cat="";var service_desc="";var staff_cadre="";var cadre_count="";
                     var serviceHeader="<table border='1' width='100%'><tr><th width='50%'>Category</th><th width='50%'>Description</th></tr>";
                     var staffHeader="<table border='1' width='100%'><tr><th width='50%'>Cadre</th><th width='50%'>Total</th></tr>";
                     var generalFooter="</table>";
                     var serviceContent="";var staffCadreContent="";
                     $.each(facility_servicesList, function(sl, itemsl) {
                    service_cat=itemsl.service_category;
                    service_desc=itemsl.service_description;
                    categoryG +="<tr><td width='50%' style='padding-left:4px;'>"+service_cat+"</td><td width='50%' style='padding-left:4px;'>"+service_desc+"</td></tr>";
                    //serviceGDescription +="<table><tr><td>"+service_desc+"</td></tr></table>";
                    service_cat="";service_desc="";
                     });
                     serviceContent=serviceHeader + categoryG + generalFooter;
                     document.getElementById('category').innerHTML = serviceContent;


                     $.each(facility_staffcadreList, function(sta, itemsStaf) {
                    staff_cadre=itemsStaf.title;
                    cadre_count=itemsStaf.Total;
                    staffCadreGeneral +="<tr><td width='50%' style='padding-left:4px;'>"+staff_cadre+"</td><td width='50%' style='text-align:right;padding-right:2px;'>"+cadre_count+"</td></tr>";
                    //serviceGDescription +="<table><tr><td>"+service_desc+"</td></tr></table>";
                    staff_cadre="";cadre_count="";
                     });
                     staffCadreContent=staffHeader + staffCadreGeneral + generalFooter;
                     document.getElementById('staffcadre').innerHTML = staffCadreContent;

                     //end service data provider

                            $('#details_Title').text(item.facility_name);

                            $('#details_onGmap').modal('show')
                             });
                        }
                    })(marker, i));





                });



        });

    }

    function viewFacilityByLevelSelectedRegion(Code,Region_Nam,dataurl){
        makeRequest(dataurl+'index.php?r=site/pie-chart-facilitytype&Code='+Code, function(data1FacilityType) {
            var dataFacilityType = JSON.parse(data1FacilityType.responseText);

        Highcharts.chart('divbarchart', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: "Operating Facilities by Type"
            },
            subtitle: {
                text: Region_Nam
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                size:'60%',
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
                }
            },
            series: [{
                name: 'Facilities',
                colorByPoint: true,
                data: dataFacilityType
            }],
            credits: {
                        enabled: false
                    },
        });
    });
    }


    function showDefaultFacilityByLevel(){
        var Code='ALL';
        var dataurlNew=window.location.origin+'/portal-hfr/web/';
        makeRequest(dataurlNew+'index.php?r=site/pie-chart-facilitytype&Code='+Code, function(data1FacilityType) {
            var dataFacilityType = JSON.parse(data1FacilityType.responseText);

            Highcharts.setOptions({
                colors: ['#87CEFA', '#006400', '#DDDF00', '#24CBE5', '#64E572', '#FF9655']
               });

        Highcharts.chart('divbarchart', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: "Operating Facilities by Type"
            },
            subtitle: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                size:'60%',
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: false
                }

            },
            series: [{
                name: 'Facilities',
                colorByPoint: true,
                data: dataFacilityType
            }],
            credits: {
                        enabled: false
                    },
        });
    });
    }

    function viewFacilityByOwnershipSelectedRegion(Code,Region_Nam,dataurl){
        makeRequest(dataurl+'index.php?r=site/pie-chart-facility-byownership&Code='+Code, function(data1FacilityByOwnership) {
            var dataFacilityByOwnership = JSON.parse(data1FacilityByOwnership.responseText);

        Highcharts.chart('divpiechartownership', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                options3d: {
            enabled: true,
            alpha: 45
        }
            },
            title: {
                text: "Operating Facilities by Ownership"
            },
            subtitle: {
                text: Region_Nam
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                size:'80%',
                allowPointSelect: true,
                cursor: 'pointer',
                allowPointSelect: true,
                cursor: 'pointer',
                innerSize: 50,
                depth: 45,
                dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.1f} %',
                    style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true
                }

            },
            series: [{
                name: 'Facilities',
                colorByPoint: true,
                data: dataFacilityByOwnership
            }],
            credits: {
                        enabled: false
                    },
        });
    });
    }



    function showDefaultFacilityByOwnership(){
        var Code='ALL';
        var dataurlNew=window.location.origin+'/portal-hfr/web/';
        makeRequest(dataurlNew+'index.php?r=site/pie-chart-facility-byownership&Code='+Code, function(data1FacilityType) {
            var dataFacilityType = JSON.parse(data1FacilityType.responseText);

        Highcharts.chart('divpiechartownership', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                options3d: {
            enabled: true,
            alpha: 45
        }
            },
            title: {
                text: "Operating Facilities by Ownership"
            },
            subtitle: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                size:'80%',
                allowPointSelect: true,
                cursor: 'pointer',
                allowPointSelect: true,
                cursor: 'pointer',
                innerSize: 50,
                depth: 45,
                dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.1f} %',
                    style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true
                }

            },
            series: [{
                name: 'Facilities',
                colorByPoint: true,
                data: dataFacilityType
            }],
            credits: {
                        enabled: false
                    },
        });
    });
    }



    function showDefaultFacilityOperatingByRegion(){
        var dataurlNew=window.location.origin+'/portal-hfr/web/';
        makeRequest(dataurlNew+'index.php?r=site/barchart-facility-operating-byregion', function(data1FacilityType) {
            var dataFacilityType = JSON.parse(data1FacilityType.responseText);
    Highcharts.chart('divbarchartOperatingByRegion', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Operating Facilities by Region'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">Total Facilities: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: false
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Regions',
            data: dataFacilityType
        }]
    });
    });
}

function viewFacilityOperatingBySelectedRegion(Code,Region_Nam,dataurl){
        makeRequest(dataurl+'index.php?r=site/barchart-facility-operating-byregion&Code='+Code, function(data1FacilityType) {
            var dataFacilityType = JSON.parse(data1FacilityType.responseText);
    Highcharts.chart('divbarchartOperatingByRegion', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Operating Facilities by Region'
        },
        subtitle: {
            text: Region_Nam
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">Total Facilities: </td>' +
                '<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: false
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Councils',
            data: dataFacilityType
        }]
    });
    });
}   
     