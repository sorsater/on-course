import urllib.request
from bs4 import BeautifulSoup


url_utbildningar = 'http://www.lith.liu.se/sh/civing/'
url_datateknik7 = 'http://kdb-5.liu.se/liu/lith/studiehandboken/action.lasso?&-response=lot_response.lasso&-op=eq&kp_budget_year=2017&-op=eq&kp_programkod=D&-op=eq&kp_programprofil=D&-op=gt&kp_termin=6'
def get_courses(url):
    x = urllib.request.urlopen(url)
    soup = BeautifulSoup(x.read(), 'html.parser')
    table = soup.find('table').find('table')
    rows = table.find_all('tr')

    courses = {}
    course_schedule_dic = {}
    for row in rows[3:]:
        tds = row.find_all('td')
        # Course
        if len(tds) > 2:
            a = tds[1].find('a')
            if a:
                kurskod = a.string
                link = a['href']
                name, level, vof, block, hp = [td.string.strip() for td in tds[2:]]
                courses[kurskod] = [name, level, hp.replace('*', '')]

                # Both periods
                if '*' in hp:
                    period = current_period[0] + '0'
                else:
                    period = current_period[0] + current_period[-1]

                if current_period[-1] == '2' and '*' in hp:
                    course_schedule_dic[kurskod+period][3] = block
                else:
                    course_schedule_dic[kurskod+period] = [kurskod, period, block, '']

        # HT/VTh
        else:
            a = tds[1].find('span')
            if a:
                current_period = a.string
    course_schedule = []
    for code in course_schedule_dic:
        course_schedule.append(course_schedule_dic[code])

    return courses, course_schedule

def get_utbildningar(url):
    x = urllib.request.urlopen(url)
    soup = BeautifulSoup(x.read(), 'html.parser')
    table = soup.find_all('table')[1].find('table')
    rows = table.find_all('tr')

    utbildningar = {}
    for row in rows[1:-1]:
        utbildning = row.find('b').string
        links = row.find_all('a')
        utbildningar[utbildning] = {'href' : url + links[2]['href']}

    return utbildningar

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
        masters = [a.string for a in p.find_all('a')]
        fields[field] = masters

    return fields


def main():
    utbildningar = get_utbildningar(url_utbildningar)
    for u,d in utbildningar.items():
        fields = get_fields(d['href'])
        utbildningar[u]['fields'] = fields


    for u,d in utbildningar.items():
        print(u)
        for field, masters in d['fields'].items():
            print('\t'+field)
            for m in masters:
                print('\t\t',end='')
                print(m)
        print()

courses, course_schedule = get_courses(url_datateknik7)
for c in course_schedule:
    print(c)