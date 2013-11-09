//Global Variables to be used

var date = new Date(); 	//date to be manipulated

//DEFAULT DATE DATA
var defaultDay = date.getDate();
var defaultMonth = date.getMonth();
var defaultYear = date.getFullYear();

//TO BE USED FOR CALENDAR MAKING
var day = date.getDate();
var year = date.getFullYear();
var monthNames = ["January","February","March","April","May","June","July","August","September","October","November", "December"]; 

//leap year check for calendar
function leapYear(fYear){

	if ((fYear%100!=0) && (fYear%4==0) || (fYear%400==0)){
		return 29;
	}
	return 28;
}

/******************************************************************************************************************
	CALENDAR FUNCTION: draws the calendar
		By default, calendar for current month & year is shown.
		When '<','<<','>', or '>>' are clicked, calendar is redrawn with the appropriate changes for month or year 
		When a day is clicked, events() is executed, inserting a time and description for an event into day clicked

*******************************************************************************************************************/

function calendar(month, yr){

	var daysInWeek = 7; //Used to create a loop for the days in the week.
	var calendarDrawing;  //Variable used later to create the calendar.

	// Setting the value of the date if user has choosen a different month or year.
	if (month || yr){
		newDate = new Date(month + day + yr);
	}
	else{
		newDate = new Date();
	}

	var tempYear = newDate.getFullYear();  //Getting the year of newDate 

	var tempDate = new Date((newDate.getMonth()+1) +' 1 ,'+tempYear);  //Creating a temp date to find first day of month
	var startDay = tempDate.getDay();
	var w = startDay; //copying startDay value for use in while loop to draw calendar
	
	var newMonth = newDate.getMonth();
	var newYear = newDate.getFullYear();

	//Leap year check (extra day in February?)
	var daysInFeb = leapYear(tempYear);

	var totalDays = ["31", ""+daysInFeb+"","31","30","31","30","31","31","30","31","30","31"]  //Array of the days in each month.

	calendarDrawing = "<table class='calendar'>";

	//Header for calendar
	calendarDrawing += "<tr class='daysOfCurrentMonth'>";
	calendarDrawing += "<th><span onclick='calendar(date.getMonth(), date.setFullYear(date.getFullYear()-1))'>&lt;&lt;&nbsp;</span></th>";
	calendarDrawing += "<th><span onclick='calendar(date.setMonth(date.getMonth()-1),date.getFullYear())'>&lt;&nbsp;</span></th>";
	calendarDrawing += "<th colspan='3'>" + monthNames[newMonth] + " " + newYear + "</th>";
	calendarDrawing += "<th><span onclick='calendar(date.setMonth(date.getMonth()+1), date.getFullYear())'>&nbsp;&gt;</span></th>";
	calendarDrawing += "<th><span onclick='calendar(date.getMonth(), date.setFullYear(date.getFullYear()+1))'>&nbsp;&gt;&gt;</span></th></tr>";

	//Header for weekdays
	calendarDrawing += "<tr class='weekdays'>  <th>Sun</th>  <th>Mon</th> <th>Tues</th> <th>Wed</th> <th>Thu</th> <th>Fri</th> <th>Sat</th> </tr>";

	//START OF PRINTING OF DAYS IN MONTH

	calendarDrawing += "<tr>";

	//Getting the total amount of days in the previous month
	//	 for Figuring out number of cells to fill with &nbsp in order for appropriate weekday position for first day of month	

	var prevMonth = (newMonth-1);
	var prevMonthdays = totalDays[prevMonth];

	if (prevMonth < 0){
		var previousMonthDaysFromLastWeek = 31 - startDay +1;
	}
	else{
		var previousMonthDaysFromLastWeek = prevMonthdays - startDay + 1;
	}

	if (startDay != 0){
		while (startDay > 0){
			calendarDrawing += "<td>&nbsp;</td>";
			previousMonthDaysFromLastWeek++;
			startDay --;
		}
	}

	//PRINTING DAYS OF MONTH

	var i = 1 //Setting the counter to 1 to loop through the days of the month.

	while (i<=totalDays[newMonth]){


		//Checking if the 7 days in a week have been filled for one row/week
		if (w > 6){
			w = 0;
			calendarDrawing += "</tr><tr>";
		}

		// If calendar is displaying current month and year, current date will be highlighted
		if (i == defaultDay && newMonth == defaultMonth && newYear == defaultYear){
			calendarDrawing += "<td class='currentDate' onMouseover='this.style.background=\"#7EC0EE\"; this.style.color=\"#FFFFFF\"' "
							+ "onMouseOut='this.style.background=\"#7EC000\"; this.style.color=\"#000000\"' "
							+ "onclick =\"events("+i+","+newMonth+","+newYear+")\">  " +i+ "<ul id=\"desc_"+i+"\">"
							+ "</ul></td>";							
		}
		else{
			calendarDrawing += "<td class='daysOfCurrentMonth' onMouseOver='this.style.background=\"#7EC0EE\"; this.style.color=\"#FFFFFF\"' "
							+ "onMouseOut='this.style.background=\"#FFFFFF\"; this.style.color=\"#000000\"' "
							+ "onclick =\"events("+i+","+newMonth+","+newYear+")\">  " +i+ "<ul id=\"desc_"+i+"\">"
							+ "</ul></td>";
		}


		i++;	//go to next ith day
		w++;	//increase number of days to check for filled week (7 days)
	}

	//Finish padding the month with the start of the following month
	while (w <= 6){
		calendarDrawing += "<td>&nbsp;</td>";
		w++;
	}

		$.getJSON("/appointments",function(data){
			for (var j=0; j<data.length; j++) {
				if(data[j].year == newYear && data[j].month-1 == newMonth){
					$("#desc_"+data[j].day).append(data[j].time + " " + data[j].description + "<br><br>");
				}
			}
		});	


	//Closing the table cleanly.
	calendarDrawing += "</tr></table>";

	document.getElementById('calendar').innerHTML = calendarDrawing;
}

/*******************
	EVENTS FUNCTION: inputs time and description to date
		Default date is current date
		When date from calendar is clicked, events redraws without date's events previously entered

************/

function events(eDay,eMonth,eYear){
	//if date is the same as last call, keep events previously stored
	if(desc_id.value != ""){
		$("#desc_"+eDay).append("<li>"+ time_id.value +" "+ desc_id.value + "</li>");
		
		$.ajax({
			type: "POST",
			url: "/appointments",
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify({"appointment": {"year": eYear, "month": eMonth+1, "day": eDay, "time": time_id.value, "description": desc_id.value}})
		});		
	}

	else{
		var x = prompt("Please enter description: ");
		while(x == ""){
			x = prompt("Please enter description: ");
		}
		desc_id.value = x;
		events(eDay);
	}

	desc_id.value = "";
	time_id.value = "00:00";	

}