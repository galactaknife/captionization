import subprocess

def captionize(mp4, srt, output):
    process = subprocess.Popen(str("ffmpeg -i " + mp4 + " -vf subtitles=" + srt + " " + output).split(), stdout=subprocess.PIPE)
    output, error = process.communicate()
