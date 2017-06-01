import urllib.request
from bs4 import BeautifulSoup

from res.w8m8 import progressbar

url_utbildningar = 'http://www.lith.liu.se/sh/civing/'
url_datateknik7 = 'http://kdb-5.liu.se/liu/lith/studiehandboken/action.lasso?&-response=lot_response.lasso&-op=eq&kp_budget_year=2017&-op=eq&kp_programkod=D&-op=eq&kp_programprofil=D&-op=gt&kp_termin=6'

# Read all courses from the URL
def get_courses(url, programID):
    x = urllib.request.urlopen(url)
    soup = BeautifulSoup(x.read(), 'html.parser')
    table = soup.find('table').find('table')
    rows = table.find_all('tr')

    courses = set()
    schedule = {}
    program_courses = set()
    for row in rows[3:]:
        tds = row.find_all('td')
        # Course
        if len(tds) > 2:
            a = tds[1].find('a')
            if a:
                kurskod = a.string
                link = a['href']
                name, level, vof, block, hp = ['-' if not td.string else td.string.strip() for td in tds[2:]]
                courses.add( (kurskod, name, level, hp.replace('*', ''), link) )
                program_courses.add( (kurskod, programID) )

                # Both periods
                if '*' in hp:
                    period = current_period[0] + '0'
                else:
                    period = current_period[0] + current_period[-1]

                if current_period[-1] == '2' and '*' in hp:
                    schedule[kurskod+period][4] = block
                else:
                    if current_period[-1] == '2':
                        schedule[kurskod+period] = [kurskod, period[0], period[1], '', block]
                    else:
                        schedule[kurskod+period] = [kurskod, period[0], period[1], block, '']

        # HT/VTh
        else:
            a = tds[1].find('span')
            if a:
                current_period = a.string

    courses = [list(c) for c in courses]
    courses = list(courses)

    program_courses = [list(c) for c in program_courses]
    program_courses = list(program_courses)

    #schedule = [schedule[key] for key in schedule]
    #schedule = [schedule[key] for key in schedule]

    return courses, schedule.values(), program_courses

# For each masters profile
def get_profile_courses(url):
    #print(url)
    # Ser inte längre folk i ögonen
    url = url.replace('ö', 'o').replace('ä', 'a').replace('å', 'a')
    x = urllib.request.urlopen(url)
    soup = BeautifulSoup(x.read(), 'html.parser')
    rows = soup.find_all('tr')

    courses = set()
    for row in rows[3:]:
        tds = row.find_all('td')
        if len(tds) > 2:
            a = tds[1].find('a')
            if a:
                kurskod = a.string
                link = a['href']
                name, level, vof, block, hp = [td.string.strip() for td in tds[2:]]
                courses.add( (kurskod, vof) )

    courses = list(courses)

    return courses

# Read all programs and their main subjects
def get_utbildningar(url):
    x = urllib.request.urlopen(url)
    soup = BeautifulSoup(x.read(), 'html.parser')
    table = soup.find_all('table')[1].find('table')
    rows = table.find_all('tr')

    utbildningar = {}
    for i, row in enumerate(rows[1:-1]):
        utbildning = row.find('b').string
        links = row.find_all('a')
        utbildningar[utbildning] = {'ID' : i + 1, 'href' : url + links[2]['href']}

    return utbildningar

# Get all links and their names
def get_fields(url):
    x = urllib.request.urlopen(url)
    soup = BeautifulSoup(x.read(), 'html.parser')
    links = soup.find_all('a')
    fields = soup.find_all('p')[4]
    tack = str(fields).replace('<p>', '</p><p>')
    soup = BeautifulSoup(tack, 'html.parser')
    ps = soup.find_all('p')

    termin_7_9 = ""
    for link in links:
        if link.string and '7-9' in link.string:
            termin_7_9 = link['href']

    fields = {}
    for p in ps:
        try:
            field = p.find('b').string
        except:
            continue
        masters = [[a.string, a['href']] for a in p.find_all('a')]
        fields[field] = masters

    return fields, termin_7_9

# Read courses and schedule for datateknik, need to be extended to all programs
def scrape_courses(urls):

    print("Reading all 7-9 courses")
    all_courses = []
    all_schedules = []
    all_program_courses = []
    for i, (url, programID) in enumerate(urls):
        progressbar((i+1)/len(urls))
        if url:
            courses, schedule, program_courses = get_courses(url, programID)
            all_courses += courses
            all_schedules += schedule
            all_program_courses += program_courses
    print()
    all_schedules = [[i] + x for i, x in enumerate(all_schedules)]

    all_courses = [[i] + x for i, x in enumerate(all_courses)]

    all_program_courses = [[i] + x for i, x in enumerate(all_program_courses)]

    return all_courses, all_schedules, all_program_courses

# Read programs, fields, masters. Converted to list
def scrape_programs():
    utbildningar = get_utbildningar(url_utbildningar)
    # The educations
    programs = []
    field_ID = 1

    urls_all_courses = []
    for key, value in utbildningar.items():
        programs.append((value['ID'], key, value['href']))
        utbildningar[key]['fields'], all_courses = get_fields(value['href'])
        urls_all_courses.append([all_courses, value['ID']])

    fields = []
    profiles = []

    field_ID = 1
    master_ID = 1
    for key, value in utbildningar.items():
        program_ID = value['ID']
        for field, masters in value['fields'].items():
            fields.append((field_ID, field, program_ID))
            for master in masters:
                profiles.append((master_ID, master[0], field_ID, master[1]))
                master_ID += 1
            field_ID += 1

    print("Reading all profiles")
    course_profile = []
    course_profile_cnt = 1

    #return programs, fields, profiles, course_profile, urls_all_courses
    for i, (master_ID, master_name, field_ID, master_link) in enumerate(profiles):
        progressbar((i+1)/len(profiles))
        courses = get_profile_courses(master_link)

        for course in courses:
            course_profile.append( (course_profile_cnt, course[0], master_ID, course[1]))
            course_profile_cnt += 1
    print()
    return programs, fields, profiles, course_profile, urls_all_courses

# Get all content
def scrape_content():
    programs, fields, profiles, course_profile, urls_all_courses = scrape_programs()
    courses, schedule, program_courses = scrape_courses(urls_all_courses)

    return courses, schedule, program_courses, programs, fields, profiles, course_profile
