import urllib.request
from bs4 import BeautifulSoup

from w8m8 import progressbar

url_utbildningar = 'http://www.lith.liu.se/sh/civing/'
url_datateknik7 = 'http://kdb-5.liu.se/liu/lith/studiehandboken/action.lasso?&-response=lot_response.lasso&-op=eq&kp_budget_year=2017&-op=eq&kp_programkod=D&-op=eq&kp_programprofil=D&-op=gt&kp_termin=6'

# Read all courses from the URL
def get_courses(url):
    x = urllib.request.urlopen(url)
    soup = BeautifulSoup(x.read(), 'html.parser')
    table = soup.find('table').find('table')
    rows = table.find_all('tr')

    courses = set()
    schedule = {}
    schedule_id = 1
    for row in rows[3:]:
        tds = row.find_all('td')
        # Course
        if len(tds) > 2:
            a = tds[1].find('a')
            if a:
                kurskod = a.string
                link = a['href']
                name, level, vof, block, hp = [td.string.strip() for td in tds[2:]]
                courses.add( (kurskod, name, level, hp.replace('*', ''), link) )

                # Both periods
                if '*' in hp:
                    period = current_period[0] + '0'
                else:
                    period = current_period[0] + current_period[-1]

                if current_period[-1] == '2' and '*' in hp:
                    schedule[kurskod+period][3] = block
                else:
                    schedule[kurskod+period] = [schedule_id, kurskod, period, block, '']
                    schedule_id += 1

        # HT/VTh
        else:
            a = tds[1].find('span')
            if a:
                current_period = a.string

    courses = list(courses)
    schedule = [schedule[key] for key in schedule]

    return courses, schedule

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
    fields = soup.find_all('p')[4]
    tack = str(fields).replace('<p>', '</p><p>')
    soup = BeautifulSoup(tack, 'html.parser')
    ps = soup.find_all('p')

    fields = {}
    for p in ps:
        try:
            field = p.find('b').string
        except:
            continue
        masters = [[a.string, a['href']] for a in p.find_all('a')]
        fields[field] = masters

    return fields

# Read all educations
# Not used anymore
def scrape_main_subject():
    utbildningar = get_utbildningar(url_utbildningar)
    for u,d in utbildningar.items():
        utbildningar[u]['fields'] = get_fields(d['href'])

    for u, d in utbildningar.items():
        print(u)
        print(d['href'])
        for field, masters in d['fields'].items():
            print('\t'+field)
            for m in masters:
                print('\t\t',end='')
                print(m[0])
                # Link
                print('\t\t\t' + m[1])
        print()
    return utbildningar

# Read courses and schedule for datateknik
def scrape_courses():
    return get_courses(url_datateknik7)

# Read programs, fields, masters. Converted to list
def scrape_programs():
    utbildningar = get_utbildningar(url_utbildningar)
    # The educations
    programs = []
    field_ID = 1
    for key, value in utbildningar.items():
        programs.append((value['ID'], key, value['href']))
        utbildningar[key]['fields'] = get_fields(value['href'])

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
    for i, (master_ID, master_name, field_ID, master_link) in enumerate(profiles):
        progressbar((i+1)/len(profiles))
        courses = get_profile_courses(master_link)

        for course in courses:
            course_profile.append( (course_profile_cnt, course[0], master_ID, course[1]))
            course_profile_cnt += 1
    print()
    return programs, fields, profiles, course_profile














